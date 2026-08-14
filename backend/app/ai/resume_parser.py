import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_path):
    """
    Extract all text from a PDF.
    """

    document = fitz.open(pdf_path)

    text = ""

    print("\n==============================")
    print("Reading Resume:")
    print(pdf_path)
    print("==============================\n")

    for page_number, page in enumerate(document):
        page_text = page.get_text()

        print(f"\n----- PAGE {page_number + 1} -----")
        print(page_text)

        text += page_text

    document.close()

    print("\n========== FINAL RESUME TEXT ==========")
    print(text)
    print("=======================================\n")

    return text