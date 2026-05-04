import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("ERROR: No GOOGLE_API_KEY found in .env")
else:
    try:
        genai.configure(api_key=api_key)
        print("Fetching available models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
