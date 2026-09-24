import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, render_template, request
from groq import Groq

app = Flask(__name__)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def ask_groq(question):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing from the server environment.")

    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": question}],
        temperature=0.2,
        max_completion_tokens=300,
    )
    return completion.choices[0].message.content or "The model returned an empty response."


@app.route("/", methods=["GET", "POST"])
def index():
    captured_text = None
    llm_response = None
    error_message = None

    if request.method == "POST":
        captured_text = request.form.get("user_text", "")
        print(f"Captured text: {captured_text}", flush=True)
        try:
            llm_response = ask_groq(captured_text)
            print(f"Groq response: {llm_response}", flush=True)
        except Exception as error:
            print(f"Groq request failed: {type(error).__name__}: {error}", flush=True)
            error_message = "Groq could not answer. Check the API key, model setting, or network and try again."

    return render_template(
        "index.html",
        captured_text=captured_text,
        llm_response=llm_response,
        error_message=error_message,
    )


if __name__ == "__main__":
    app.run()
