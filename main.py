import os
from dotenv import load_dotenv

load_dotenv()

from sarvamai import SarvamAI

api_key = os.getenv("SARVAM_API_KEY")
if not api_key:
    raise ValueError("SARVAM_API_KEY is not set in environment or .env file.")

client = SarvamAI(api_subscription_key=api_key)

response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[
        {"role": "user", "content": "Hello! Give a brief one-sentence greeting."}
    ],
)

print(response.choices[0].message.content)
