# from fastapi import APIRouter, File, UploadFile
# from reportlab.lib.pagesizes import letter
# from reportlab.pdfgen import canvas
# from PyPDF2 import PdfReader, PdfWriter
# import os
# import tempfile
# import shutil

# KaniniFormat = APIRouter()

# def find_and_replace_text(pdf_path, replacements):
#     temp_overlay_path = f"{tempfile.mkdtemp()}/overlay.pdf"
    
#     overlay_pdf = canvas.Canvas(temp_overlay_path, pagesize=letter)
#     overlay_pdf.setFont("Helvetica", 12)
    
#     for old_text, new_text in replacements.items():
#         overlay_pdf.drawString(10, 800, new_text)

#     overlay_pdf.save()  # Manually save and close the canvas

#     with open(pdf_path, 'rb') as original_pdf:
#         with open(temp_overlay_path, 'rb') as overlay:
#             with open('path/to/modified.pdf', 'wb') as output_pdf_stream:
#                 overlay_pdf = PdfReader(overlay)
#                 original_pdf = PdfReader(original_pdf)
#                 output_pdf = PdfWriter()

#                 for page_num in range(len(original_pdf.pages)):
#                     page = original_pdf.pages[page_num]
#                     overlay_page = overlay_pdf.pages[0]
#                     page.merge_page(overlay_page)
#                     output_pdf.add_page(page)

#                 output_pdf.write(output_pdf_stream)

# @KaniniFormat.post("/replacepdf/")
# async def replace_text_in_pdf(file: UploadFile = File(...)):
#     # Create a temporary directory to store the uploaded file
#     with tempfile.TemporaryDirectory() as temp_dir:
#         temp_file_path = f"{temp_dir}/temp.pdf"

#         # Save the uploaded file to the temporary location
#         with open(temp_file_path, 'wb') as temp_file:
#             shutil.copyfileobj(file.file, temp_file)

#         # Define text replacements
#         replacements = {
#             'Nashville': 'chennai',
#             # Add more key-value pairs for other text replacements
#         }

#         # Perform the text replacement in the PDF
#         find_and_replace_text(temp_file_path, replacements)

#         return {"message": "Text replaced successfully!"}
