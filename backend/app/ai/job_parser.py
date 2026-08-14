import os
import PyPDF2


def extract_text_from_job(file_path: str):
    """
    Extract text from a Job Description file.
    Supports PDF and TXT files.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError("Job Description file not found.")

    extension = os.path.splitext(file_path)[1].lower()

    # -----------------------------
    # PDF
    # -----------------------------
    if extension == ".pdf":

        text = ""

        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text.strip()

    # -----------------------------
    # TXT
    # -----------------------------
    elif extension == ".txt":

        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    else:
        raise ValueError("Only PDF and TXT Job Descriptions are supported.")