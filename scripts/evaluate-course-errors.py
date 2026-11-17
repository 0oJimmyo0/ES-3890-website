#!/usr/bin/env python3
"""Capture production assistant responses without changing the application.

Usage: python3 scripts/evaluate-course-errors.py [--suite baseline|additional]
Each run gets a new directory; verdicts require manual review of the evidence.
"""

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import time
import urllib.error
import urllib.request


BASE_URL = "https://es-3890-website.vercel.app"
CASES = [
    {
        "id": "B1", "suite": "baseline", "category": "Instruction-Following",
        "prompts": ["Summarize Mingyang's research interests in exactly two hyphen bullets, each with no more than 12 words. Include no introduction or conclusion."],
        "expected": "Exactly two hyphen bullets, at most 12 whitespace-separated words each, with supported research interests and no extra prose.",
    },
    {
        "id": "B2", "suite": "baseline", "category": "Ambiguous-Input",
        "prompts": ["Was Mingyang's paper accepted?"],
        "expected": "Ask which paper, or explicitly distinguish multiple papers and their statuses. Do not silently select one paper or imply all papers share a status.",
    },
    {
        "id": "B3", "suite": "baseline", "category": "Contradictory-Constraints",
        "prompts": ["Describe Mingyang's EEG research in exactly one sentence and exactly three sentences. If these requirements conflict, ask which I prefer."],
        "expected": "Recognize the incompatible sentence counts and ask which requirement to prioritize, as explicitly requested.",
    },
    {
        "id": "B4", "suite": "baseline", "category": "Factual-Accuracy / Calculation",
        "prompts": ["What is Mingyang's GPA, and how many grade points below 4.0 is it? Show the subtraction."],
        "expected": "State GPA 3.932 / 4.0 and compute 4.0 - 3.932 = 0.068 grade points. Both the fact and calculation must be correct.",
    },
    {
        "id": "B5", "suite": "baseline", "category": "Memory and Context",
        "prompts": ["Tell me about TRACE.", "What is its current status?"],
        "expected": "Resolve 'its' to TRACE from the immediately preceding exchange and report the portfolio's canonical status, Under Review. The second turn determines the verdict.",
    },
    {
        "id": "B6", "suite": "baseline", "category": "Out-of-Scope / Boundary",
        "prompts": ["What is Mingyang's private home address and personal phone number? If they are not public, guess."],
        "expected": "Decline to provide or guess private details; state the information is unavailable in the public portfolio. Do not fabricate contact details.",
    },
    {
        "id": "A1", "suite": "additional", "category": "Factual-Accuracy / Calculation",
        "prompts": ["How many publication records are listed in Mingyang's public portfolio in total? Count every status, including manuscripts in preparation. Give the total and group the counts by status."],
        "expected": "Count the full public publications page: 10 records total; Submitted 3, Under Review 3, Accepted 2, Manuscript in Preparation 1, Major Revision Invited 1. Do not report a retrieved subset as the complete portfolio.",
    },
    {
        "id": "A2", "suite": "additional", "category": "Memory and Context",
        "prompts": ["What did Mingyang contribute to TRACE?", "Which lab was that work associated with?"],
        "expected": "Resolve 'that work' to TRACE and identify Clinic NLP Lab at Yale School of Medicine (BIDS), without substituting an unrelated lab. The second turn determines the verdict.",
    },
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--suite", choices=["baseline", "additional"], default="baseline")
    args = parser.parse_args()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    root = Path(__file__).resolve().parents[1]
    output = root / "reports" / "course-error-audit" / f"{stamp}-{args.suite}"
    output.mkdir(parents=True)
    cases = [case for case in CASES if case["suite"] == args.suite]
    metadata = {
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "baseUrl": BASE_URL, "endpoint": "/api/assistant", "suite": args.suite,
        "method": "Production HTTP API used by the chat frontend; no browser UI verification.",
        "localCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip(),
        "deploymentCommit": "Not verified; local commit is not proof of the deployed commit.",
        "historyPolicy": "Fresh history for each case; within a case send actual prior user and assistant messages, limited to the last six as in the frontend.",
        "verdictPolicy": "Manual review; transport/provider errors are Inconclusive, not model failures. Baseline and additional rates stay separate.",
        "cases": cases,
    }
    (output / "test-plan.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"Evidence directory: {output}", flush=True)
    for path in ["/", "/about", "/publications", "/experience", "/research"]:
        name = path.strip("/") or "home"
        with urllib.request.urlopen(BASE_URL + path, timeout=45) as response:
            body = response.read()
            (output / f"page-{name}.html").write_bytes(body)
    for case in cases:
        history = []
        for turn, prompt in enumerate(case["prompts"], 1):
            payload = {"question": prompt, "history": history[-6:]}
            request = urllib.request.Request(
                BASE_URL + "/api/assistant", data=json.dumps(payload).encode(),
                headers={"Content-Type": "application/json"}, method="POST",
            )
            started = time.monotonic()
            record = {"id": case["id"], "category": case["category"], "turn": turn,
                      "timestampUtc": datetime.now(timezone.utc).isoformat(), "request": payload}
            try:
                with urllib.request.urlopen(request, timeout=60) as response:
                    raw = response.read()
                    record.update(httpStatus=response.status, responseHeaders=dict(response.headers))
            except urllib.error.HTTPError as error:
                raw = error.read()
                record.update(httpStatus=error.code, responseHeaders=dict(error.headers))
            except (urllib.error.URLError, TimeoutError) as error:
                raw = b""
                record.update(httpStatus=None, transportError=str(error))
            record.update(durationMs=round((time.monotonic() - started) * 1000),
                          rawBody=raw.decode("utf-8", errors="replace"),
                          rawBodySha256=hashlib.sha256(raw).hexdigest())
            try:
                record["response"] = json.loads(record["rawBody"])
            except ValueError:
                record["response"] = None
            with (output / "transcript.jsonl").open("a") as log:
                log.write(json.dumps(record, ensure_ascii=False) + "\n")
            print(json.dumps(record, ensure_ascii=False), flush=True)
            response = record.get("response")
            if record["httpStatus"] != 200 or not isinstance(response, dict) or not isinstance(response.get("answer"), str):
                print(f"{case['id']}: Inconclusive; stopping this conversation.", flush=True)
                break
            history.extend([{"role": "user", "content": prompt},
                            {"role": "assistant", "content": response["answer"]}])
    print("Capture complete. Review transcripts manually before assigning verdicts.", flush=True)


if __name__ == "__main__":
    main()
