from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from weasyprint import HTML
import json

from engine import preview_html

app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Vite Docker
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PdfRequest(BaseModel):
    html: str
    filename: str | None = "document.pdf"


@app.post("/generate-pdf")
async def generate_pdf(data: PdfRequest):
    pdf_bytes = HTML(string=data.html).write_pdf()
    headers = {
        "Content-Disposition": f'attachment; filename="{data.filename}"'
    }

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers=headers
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
    pdf_bytes = HTML(string=result["html"]).write_pdf()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf"
    )
