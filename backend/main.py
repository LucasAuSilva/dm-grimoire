from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

from engine import preview_html

app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/preview")
async def preview(
    files: List[UploadFile] = File(...),
    config: str = Form(...)
):
    """
    files: uploaded markdown files
    config: JSON string with preview configuration
    """

    config = json.loads(config)
    md_files = []

    for file in files:
        content = (await file.read()).decode("utf-8")
        name = file.filename.replace(".md", "")
        md_files.append({
            "name": name,
            "content": content
        })

    result = preview_html(md_files, config)
    return result
