import asyncio
import json
import websockets
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import wave
import io
import base64
import firebase_admin
from firebase_admin import credentials, firestore
import pymongo
from pymongo import MongoClient
from datetime import datetime, timedelta
from collections import Counter

load_dotenv()

API_KEY = os.getenv('AI_API')
print(genai.__version__)

# Initialize Firebase Admin
try:
    cred = credentials.Certificate('moodbuddy-3d25f-firebase-adminsdk-fbsvc-ad0b93efad.json')
    firebase_admin.initialize_app(cred)
    db_firestore = firestore.client()
    print("Firebase initialized successfully!")
except Exception as e:
    print(f"Error initializing Firebase: {e}")

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URI'))
# Specify the database name explicitly
db = client['moodbuddy-db']  # Use the database name from your connection string
print(f"[MongoDB] Connected to database: moodbuddy-db")

# Function to get user data from Firebase
def get_user_data(user_id):
    try:
        user_doc = db_firestore.collection('users').document(user_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            print(f"\nUser data for {user_id}:", user_data)
            return user_data
        else:
            print(f"No user found with ID: {user_id}")
            return None
    except Exception as e:
        print(f"Error getting user data: {e}")
        return None

# Function to get recent journal entries
async def get_recent_journal_entries(user_id, days=365):
    try:
        print(f"[MongoDB] Fetching journal entries for user: {user_id}")
        client = MongoClient(os.getenv('MONGODB_URI'))
        db = client['test']
        print(f"[MongoDB] Connected to database: test")
        journals = list(db.journals.find({"userId": user_id}).sort("date", -1))
        print(f"[MongoDB] Found {len(journals)} journals for user {user_id}")
        entries = []
        for journal in journals:
            print(f"[MongoDB] Processing journal from date: {journal.get('date')}")
            if "entries" in journal:
                for entry in journal.get("entries", []):
                    entries.append({
                        "date": journal["date"],
                        "mood": entry.get("mood"),
                        "text": entry.get("text", ""),
                        "time": entry.get("time"),
                        "factors": entry.get("factors", [])
                    })
            else:
                print(f"[MongoDB] Journal {journal.get('_id')} has no entries field")
        print(f"[MongoDB] Processed {len(entries)} total entries")
        client.close()
        if entries:
            return entries
        else:
            print(f"[MongoDB] No entries found")
            return []
    except Exception as e:
        print(f"[MongoDB] Error getting journal entries: {e}")
        import traceback
        traceback.print_exc()
        return []

client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})
model = "gemini-2.0-flash-live-001"

def write_pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, channels: int = 1) -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, 'wb') as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(pcm_data)
    return buffer.getvalue()

def detect_format_from_base64(base64_str):
    decoded = base64.b64decode(base64_str)
    if decoded.startswith(b"RIFF"):
        return "WAV"
    return "Unknown"

async def handle_request(client_ws):
    try:
        setup_msg = await client_ws.recv()
        setup_data = json.loads(setup_msg)
        setup = setup_data.get("setup", {})
        
        # Get user ID from setup message
        user_id = None
        user_mbti = None
        
        if "userId" in setup_data:
            user_id = setup_data["userId"]
            print(f"\n[Server] User connected with ID: {user_id}")
            
            # Get user data from Firebase
            user_data = get_user_data(user_id)
            if user_data:
                user_mbti = user_data.get('mbti')
                if user_mbti:
                    print(f"[Server] User MBTI: {user_mbti}")
            
            # Get recent journal entries
            journal_entries = await get_recent_journal_entries(user_id)
            print(f"[Server] Found {len(journal_entries)} recent journal entries")
            
            # Print journal entries for debugging
            if journal_entries:
                print("\n[Server] Journal entries details:")
                for entry in journal_entries:
                    print(f"  - Date: {entry.get('date')}, Mood: {entry.get('mood')}, Text: {entry.get('text')}")
            else:
                print("[Server] No journal entries found for this user")
        else:
            print("[Server] No user ID provided in setup message")

        # Create personalized system instruction based on MBTI
        system_instruction = "You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention."

        # **Mood Analysis and Integration**
        moods = [entry.get("mood") for entry in journal_entries if entry.get("mood")]
        mood_counts = Counter(moods)
        most_common_mood = mood_counts.most_common(1)[0][0] if moods else "neutral"

        system_instruction += f"\n\nBased on the user's recent journal entries, they have been feeling mostly {most_common_mood} recently."
        system_instruction += "\nHere's a summary of their recent emotional state based on their journal entries:\n"

        for entry in journal_entries:
            date_str = entry["date"].strftime("%Y-%m-%d")
            mood = entry.get("mood", "Unknown")
            text = entry.get("text", "")
            time = entry.get("time", "")
            system_instruction += f"\n- On {date_str} at {time}, they felt {mood}: '{text}'"

        system_instruction += "\n\nGiven this context, respond to the user in a way that acknowledges their recent emotional state and provides appropriate support."

        # **MBTI-Specific Communication (if available)**
        if user_mbti:
            system_instruction += f"\n\nThe user's MBTI type is {user_mbti}. Adapt your communication style to match this personality type:"
            
            # E vs I (Extraversion vs Introversion)
            if 'E' in user_mbti:
                system_instruction += "\n- Be more outgoing and energetic in your responses"
                system_instruction += "\n- Use more expressive language and be more direct"
                system_instruction += "\n- Be willing to discuss multiple topics and ideas"
            else:  # 'I' in user_mbti
                system_instruction += "\n- Be more gentle and reserved in your responses"
                system_instruction += "\n- Give the user time to process information"
                system_instruction += "\n- Focus on one topic at a time and be more reflective"
            
            # S vs N (Sensing vs Intuition)
            if 'S' in user_mbti:
                system_instruction += "\n- Focus on concrete, practical advice and real-world examples"
                system_instruction += "\n- Be specific and detailed in your explanations"
                system_instruction += "\n- Use more literal language and avoid abstract concepts"
            else:  # 'N' in user_mbti
                system_instruction += "\n- Explore abstract ideas and possibilities"
                system_instruction += "\n- Be more conceptual and theoretical in your approach"
                system_instruction += "\n- Use metaphors and analogies to explain concepts"
            
            # T vs F (Thinking vs Feeling)
            if 'T' in user_mbti:
                system_instruction += "\n- Be logical and analytical in your responses"
                system_instruction += "\n- Focus on facts and objective information"
                system_instruction += "\n- Be direct and straightforward in your communication"
            else:  # 'F' in user_mbti
                system_instruction += "\n- Be empathetic and emotionally supportive"
                system_instruction += "\n- Focus on how decisions affect people and relationships"
                system_instruction += "\n- Use more emotionally resonant language"
            
            # J vs P (Judging vs Perceiving)
            if 'J' in user_mbti:
                system_instruction += "\n- Provide structure and clear conclusions"
                system_instruction += "\n- Be organized and methodical in your approach"
                system_instruction += "\n- Help the user make decisions and reach closure"
            else:  # 'P' in user_mbti
                system_instruction += "\n- Be more flexible and open-ended in your responses"
                system_instruction += "\n- Explore multiple options and possibilities"
                system_instruction += "\n- Allow for spontaneity and adaptability in the conversation"

        system_instruction += "\n\nTalk gently and softly, show your understanding, don't talk too much and don't provide too many suggestions. Focus on your understanding is fine."
        
        # Print the final system instruction for debugging
        print("\n[Server] Final system instruction:")
        print("=" * 50)
        print(system_instruction)
        print("=" * 50)

        setup["config"]["system_instruction"] = {
            "parts": [{
                "text": system_instruction
            }]
        }

        async with client.aio.live.connect(model=model, config=setup["config"]) as chat_session:
            print("[Server] Connected to Gemini")
            print(setup["config"])

            async def handle_client_input():
                try:
                    async for input_msg in client_ws:
                        try:
                            message = json.loads(input_msg)
                        except json.JSONDecodeError:
                            continue

                        if message.get("type") == "audio" and "data" in message:
                            base64_str = message["data"]
                            if detect_format_from_base64(base64_str) == "WAV":
                                audio_bytes = base64.b64decode(base64_str)
                                raw_pcm = audio_bytes[44:]  
                                await chat_session.send(input=types.Blob(data=raw_pcm, mime_type="audio/pcm;rate=16000"))
                                print("[Server] Sent audio chunk to Gemini")
                        elif message.get("type") == "text" and "data" in message:
                            text_input = message["data"]
                            if text_input.strip():
                                await chat_session.send(input=text_input, end_of_turn=True)
                                print("[Server] Sent text to Gemini:", text_input)
                except Exception as e:
                    print("[Server] Input Error:", e)

            async def handle_gemini_response():
                while True:
                    try:
                        pcm_chunks = []
                        text_chunks = []
                        async for response in chat_session.receive():
                            print(response)
                            if response.server_content:
                                model_turn = response.server_content.model_turn
                                if model_turn:
                                    for part in model_turn.parts:
                                        if hasattr(part, "text") and part.text:
                                            text_chunks.append(part.text)
                                        elif hasattr(part, "inline_data") and part.inline_data:
                                            pcm_chunks.append(part.inline_data.data)

                                if response.server_content.turn_complete:
                                    if pcm_chunks:
                                        wav = write_pcm_to_wav(b"".join(pcm_chunks))
                                        base64_audio = base64.b64encode(wav).decode("utf-8")
                                        await client_ws.send(json.dumps({"audio_wav": base64_audio}))
                                        print("[Server] Sent full WAV file to client")
                                        pcm_chunks.clear()
                                    if text_chunks:
                                        await client_ws.send(json.dumps({"text": "".join(text_chunks)}))
                                        print("[Server] Sent text to Gemini")
                                        text_chunks.clear()
                    except Exception as e:
                        print("[Server] Output Error:", e)

            await asyncio.gather(
                asyncio.create_task(handle_client_input()),
                asyncio.create_task(handle_gemini_response())
            )

    except Exception as e:
        print("[Server] Setup Error:", e)

async def main():
    async with websockets.serve(handle_request, "0.0.0.0", 5051):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())