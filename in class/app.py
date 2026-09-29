import os
import secrets
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session
from groq import Groq

app = Flask(__name__)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")
app.secret_key = os.getenv("FLASK_SECRET_KEY") or secrets.token_hex(32)
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax")
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
MAX_HISTORY_MESSAGES = 12

# This local demo keeps conversation transcripts in server memory, indexed by
# a signed session ID stored in the browser cookie.
conversations = {}


def ask_groq(question, history):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing from the server environment.")

    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Use the conversation history when relevant and answer clearly and concisely.",
            },
            *history[-MAX_HISTORY_MESSAGES:],
            {"role": "user", "content": question},
        ],
        temperature=0.2,
        max_completion_tokens=300,
    )
    return completion.choices[0].message.content or "The model returned an empty response."


@app.route("/", methods=["GET", "POST"])
def index():
    conversation_id = session.get("conversation_id")
    messages = conversations.get(conversation_id, [])
    captured_text = None
    error_message = None

    if request.method == "POST":
        captured_text = request.form.get("user_text", "")
        print(f"Captured text: {captured_text}", flush=True)
        try:
            llm_response = ask_groq(captured_text, messages)
            print(f"Groq response: {llm_response}", flush=True)
            if not conversation_id:
                conversation_id = str(uuid4())
                session["conversation_id"] = conversation_id
                conversations[conversation_id] = messages
            messages.extend([
                {"role": "user", "content": captured_text},
                {"role": "assistant", "content": llm_response},
            ])
        except Exception as error:
            print(f"Groq request failed: {type(error).__name__}: {error}", flush=True)
            error_message = "Groq could not answer. Check the API key, model setting, or network and try again."
            messages = [
                *messages,
                {"role": "user", "content": captured_text},
                {"role": "assistant", "content": error_message},
            ]

    return render_template(
        "index.html",
        messages=messages,
        retry_text=captured_text if error_message else "",
    )


@app.post("/reset")
def reset_conversation():
    session.pop("conversation_id", None)
    return redirect("/")


if __name__ == "__main__":
    app.run()
