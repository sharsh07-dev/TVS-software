import os
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROK_API_KEY = os.getenv("GROK_API_KEY")

SYSTEM_PROMPT = """
You are the EERIS (Evolving Ecosystem Risk Intelligence System) AI Assistant. 
EERIS is a platform by TVS Credit for internal risk intelligence that analyzes lending ecosystems, 
detects coordinated fraud rings, shared devices, dealers, guarantors, and accounts. 
You guide analysts and risk officers on how to interpret EERIS metrics like 'Ecosystem Risk Score', 
'Divergence Anomaly', and 'Entity Resolution'. 
Be professional, concise, and helpful. Always sound like an enterprise software assistant.
"""

async def chat_with_gemini(messages: List[Dict[str, str]]) -> str:
    if not GEMINI_API_KEY:
        return "Error: Gemini API Key is not configured."
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        # Convert to Gemini REST format
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg["content"]}]})
            
        # Inject system prompt into the first message
        if len(contents) > 0 and contents[0]["role"] == "user":
            original_text = contents[0]["parts"][0]["text"]
            contents[0]["parts"][0]["text"] = f"System Context: {SYSTEM_PROMPT}\n\nUser Question: {original_text}"

        data = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.3
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, timeout=8.0)
            
            if response.status_code != 200:
                return f"Gemini API Error: {response.status_code} - {response.text}"
                
            result = response.json()
            if "candidates" in result and len(result["candidates"]) > 0:
                return result["candidates"][0]["content"]["parts"][0]["text"]
            else:
                return "Error: Unexpected response format from Gemini."
                
    except Exception as e:
        return f"Error connecting to Gemini: {str(e)}"

async def chat_with_grok(messages: List[Dict[str, str]]) -> str:
    if not GROK_API_KEY:
        return "Error: Groq API Key is not configured."
        
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Format messages for standard OpenAI-compatible API
        formatted_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in messages:
            # map 'model' to 'assistant'
            role = "assistant" if msg["role"] == "model" else msg["role"]
            formatted_messages.append({"role": role, "content": msg["content"]})
        
        data = {
            "messages": formatted_messages,
            "model": "groq/compound", # Using a valid Groq model
            "temperature": 0.3
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data, timeout=8.0)
            
            if response.status_code != 200:
                return f"Groq API Error: {response.status_code} - {response.text}"
                
            result = response.json()
            return result['choices'][0]['message']['content']
            
    except Exception as e:
        return f"Error connecting to Groq: {str(e)}"

class LLMService:
    async def get_chat_response(self, provider: str, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        if provider.lower() == 'auto':
            # Try Gemini first
            reply = await chat_with_gemini(messages)
            if not reply.startswith("Error") and not reply.startswith("Gemini API Error"):
                return {"reply": reply, "provider": "gemini"}
                
            # Fallback to Groq
            print(f"Gemini failed, falling back to Groq. Reason: {reply}")
            reply_grok = await chat_with_grok(messages)
            return {"reply": reply_grok, "provider": "groq"}
            
        elif provider.lower() == 'gemini':
            reply = await chat_with_gemini(messages)
            return {"reply": reply, "provider": "gemini"}
        elif provider.lower() == 'grok' or provider.lower() == 'groq':
            reply = await chat_with_grok(messages)
            return {"reply": reply, "provider": "groq"}
        else:
            return {"reply": f"Unknown provider: {provider}", "provider": "error"}

llm_service = LLMService()
