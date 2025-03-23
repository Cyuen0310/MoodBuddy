import asyncio
import websockets
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('AI_KEY')


genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction="You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention. Talk gently and soft, show your understanding,don't talk too much and don't provide too many suggestion. Focus on your understanding is fine.",
)

async def handle_client(websocket): 
    chat_session = model.start_chat(history=[])
    
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            response = chat_session.send_message(message)
            print(f"Response: {response}")
            model_response = response.text
            await websocket.send(model_response) 
            print(f"Sent response: {model_response}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def main():
    async with websockets.serve(handle_client, "0.0.0.0", 5001):  
        print("WebSocket server running on ws://0.0.0.0:5001")
        await asyncio.Future()  # Keeps server running

if __name__ == "__main__":
    asyncio.run(main())
