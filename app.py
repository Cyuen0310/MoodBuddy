from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure your API key
genai.configure(api_key=os.getenv('AI_API'))

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE",
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction="You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention. Talk gently and soft, show your understanding,don't talk too much and don't provide too many suggestion. Focus on your understanding is fine.",
)

chat_session = model.start_chat(
    history=[]
)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = chat_session.send_message(user_input)
    model_response = response.text

    chat_session.history.append({"role": "user", "parts": [user_input]})
    chat_session.history.append({"role": "model", "parts": [model_response]})

    return jsonify({'response': model_response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # Make the server accessible externally