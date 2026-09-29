import os
import sqlite3
import secrets
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session
from groq import Groq
from markdown_it import MarkdownIt
from markupsafe import Markup

app = Flask(__name__)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")
INSTANCE_DIR = Path(app.instance_path)
INSTANCE_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_PATH = INSTANCE_DIR / "chat_history.sqlite3"
SECRET_KEY_PATH = INSTANCE_DIR / "flask_secret_key"


def get_session_secret():
    configured_secret = os.getenv("FLASK_SECRET_KEY")
    if configured_secret:
        return configured_secret

    try:
        descriptor = os.open(SECRET_KEY_PATH, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        return SECRET_KEY_PATH.read_text(encoding="utf-8").strip()

    with os.fdopen(descriptor, "w", encoding="utf-8") as secret_file:
        secret_file.write(secrets.token_hex(32))
    return SECRET_KEY_PATH.read_text(encoding="utf-8").strip()


app.secret_key = get_session_secret()
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax")
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def initialize_database():
    with sqlite3.connect(DATABASE_PATH) as database:
        database.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                conversation_id TEXT NOT NULL,
                position INTEGER NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                PRIMARY KEY (conversation_id, position)
            )
            """
        )


def load_messages(conversation_id):
    with sqlite3.connect(DATABASE_PATH) as database:
        rows = database.execute(
            "SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY position",
            (conversation_id,),
        ).fetchall()
    return [{"role": role, "content": content} for role, content in rows]


def save_exchange(conversation_id, question, answer):
    with sqlite3.connect(DATABASE_PATH) as database:
        next_position = database.execute(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM messages WHERE conversation_id = ?",
            (conversation_id,),
        ).fetchone()[0]
        database.executemany(
            "INSERT INTO messages (conversation_id, position, role, content) VALUES (?, ?, ?, ?)",
            [
                (conversation_id, next_position, "user", question),
                (conversation_id, next_position + 1, "assistant", answer),
            ],
        )


def delete_conversation(conversation_id):
    with sqlite3.connect(DATABASE_PATH) as database:
        database.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))


initialize_database()
markdown_renderer = MarkdownIt(
    "default",
    {"html": False, "linkify": False, "typographer": False},
).disable("image")


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
            *history,
            {"role": "user", "content": question},
        ],
        temperature=0.2,
        max_completion_tokens=300,
    )
    return completion.choices[0].message.content or "The model returned an empty response."


@app.route("/", methods=["GET", "POST"])
def index():
    conversation_id = session.get("conversation_id")
    messages = load_messages(conversation_id) if conversation_id else []
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
            save_exchange(conversation_id, captured_text, llm_response)
            session["conversation_id"] = conversation_id
            messages = load_messages(conversation_id)
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
        messages=[
            {
                **message,
                "rendered_content": Markup(markdown_renderer.render(message["content"]))
                if message["role"] == "assistant"
                else None,
            }
            for message in messages
        ],
        retry_text=captured_text if error_message else "",
    )


@app.post("/reset")
def reset_conversation():
    conversation_id = session.pop("conversation_id", None)
    if conversation_id:
        delete_conversation(conversation_id)
    return redirect("/")


if __name__ == "__main__":
    app.run()
