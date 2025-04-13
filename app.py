import asyncio
import json
import websockets
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('AI_API')
print(genai.__version__)

client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})
model = "gemini-2.0-flash-exp"

# async def handle_Text_client(websocket):
#     config = {
#         "system_instruction": types.Content(
#             parts=[
#                 types.Part(
#                     text="You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention. Talk gently and soft, show your understanding,don't talk too much and don't provide too many suggestion. Focus on your understanding is fine."
#                 )
#             ]
#         ),
#         "response_modalities": ["TEXT"]
#     }
#     async with client.aio.live.connect(model=model, config=config) as chat_session:
#         try:
#             async for message in websocket:
#                 print(f"Received message: {message}")

#                 await chat_session.send(input=message, end_of_turn=True)

#                 full_response = ""
#                 async for response in chat_session.receive():
#                     if response.text is not None:
#                         full_response += response.text

#                 if full_response:
#                     await websocket.send(full_response)
#                     print(f"Sent response: {full_response}")
                        
#         except websockets.exceptions.ConnectionClosed:
#             print("Client disconnected")
            
# async def handle_Voice_client(websocket):
#     config = {
#         "system_instruction": types.Content(
#             parts=[
#                 types.Part(
#                     text="You are MoodBuddy. Moodbuddy facilitates access to mental health care by tackling the top barriers to care, so that every person has the support they need and it is always available when and where they need it. MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society through unyielding guidance and individual attention. Talk gently and soft, show your understanding,don't talk too much and don't provide too many suggestion. Focus on your understanding is fine."
#                 )
#             ]
#         ),
#         "response_modalities": ["AUDIO"]
#     }
#     async with client.aio.live.connect(model=model, config=config) as chat_session:
#         try:
#             async for message in websocket:
#                 print(f"Received message: {message}")

#                 await chat_session.send(input=message, end_of_turn=True)

#             audio_data = b""

#             async for chunk in chat_session:
#                 for part in chunk.parts:
#                     if hasattr(part, 'audio') and part.audio and part.audio.buffer:
#                         print(f"[Server] Got audio chunk: {len(part.audio.buffer)} bytes")
#                         audio_data += part.audio.buffer
#                     elif hasattr(part, 'text') and part.text:
#                         print(f"[Server] Got text (ignored): {part.text}")
#                     else:
#                         print(f"[Server] Received non-audio response")

#                 if audio_data:
#                     await websocket.send(audio_data)
#                     print(f"Sent response: {len(audio_data)} bytes")
                        
#         except websockets.exceptions.ConnectionClosed:
#             print("Client disconnected")
#         except Exception as e:
#             print(f"Error in voice handler: {str(e)}")


async def handle_request(client_ws):
    try:
        # Receive initial config
        setup_msg = await client_ws.recv()
        setup_data = json.loads(setup_msg)
        setup = setup_data.get("setup", {})

        # Add system instruction
        setup["system_instruction"] = (
            "You are MoodBuddy. "
            "Moodbuddy facilitates access to mental health care by tackling the top barriers to care, "
            "so that every person has the support they need and it is always available when and where they need it. "
            "MoodBuddy strives to improve the emotional wellbeing of its users and contribute to a more supportive and better understanding society "
            "through unyielding guidance and individual attention. "
            "Talk gently and soft, show your understanding, don't talk too much and don't provide too many suggestion. "
            "Focus on your understanding is fine."
        )

        async with client.aio.live.connect(model=model, config=setup) as chat_session:
            print("[Server] Connected to Gemini")

            async def handle_client_input():
                try:
                    async for input_msg in client_ws:
                        print("[Server] Raw input_msg:", input_msg)
                        try:
                            message = json.loads(input_msg)
                        except json.JSONDecodeError as e:
                            print("[Server] JSON decode error:", e)
                            continue  # skip bad message

                        if "text" in message:
                            chunks = message["text"]
                            if isinstance(chunks, str):
                                chunks = [chunks]

                            for chunk in chunks:
                                if chunk.strip():  # skip empty or blank chunks
                                    print("[DEBUG] Sending chunk to Gemini:", repr(chunk))
                                    await chat_session.send(input = chunk, end_of_turn=True)
                                    print("[Server] Sent chunk to Gemini:", repr(chunk))
                                else:
                                    print("[DEBUG] Skipped empty chunk.")
                except Exception as e:
                    print("[Server] Input Error:", e)

            async def handle_gemini_response():
                try:
                    async for response in chat_session.receive():
                        print("[Server] Received response:", response)
                        if not response.parts:
                            continue
                        for part in response.parts:
                            if hasattr(part, "text") and part.text:
                                await client_ws.send(json.dumps({
                                    "type": "response",
                                    "data": part.text
                                }))
                except Exception as e:
                    print("[Server] Gemini Response Error:", e)

            await asyncio.gather(
                asyncio.create_task(handle_client_input()),
                asyncio.create_task(handle_gemini_response())
            )

    except Exception as e:
        print("[Server] Setup Error:", e)


async def main():
    async with websockets.serve(handle_request, "localhost", 5051):

        await asyncio.Future()  

if __name__ == "__main__":
    asyncio.run(main())
