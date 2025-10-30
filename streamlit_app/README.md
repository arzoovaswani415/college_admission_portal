# TSEC Admission Assistant (Streamlit)

Run a local Streamlit chatbot using LangChain + Gemini with a PDF knowledge base.

## Setup

1. Create a virtual environment (recommended):

```bash
python -m venv .venv
. .venv/Scripts/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Place your assets:

- `streamlit_app/assets/COLLEGE-INFORMATION.pdf`
- `streamlit_app/assets/tsec_logo.jpg` (optional)

4. Environment variables:

- Preferred: set `GOOGLE_API_KEY`.
- Or set `GEMINI_API_KEY` (auto-bridged to `GOOGLE_API_KEY`).

Windows PowerShell example:

```bash
setx GOOGLE_API_KEY "<YOUR_KEY>"
```

## Run

```bash
streamlit run app.py
```

Then open the URL Streamlit prints (usually `http://localhost:8501`).

