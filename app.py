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

load_dotenv()

API_KEY = os.getenv('AI_API')
print(genai.__version__)

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

        setup["config"]["system_instruction"] = {
            "parts": [{
                "text": (
                   "You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention. Talk gently and soft, show your understanding,don't talk too much and don't provide too many suggestion. Focus on your understanding is fine."
                )
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
                                        print("[Server] Sent text to client")
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
