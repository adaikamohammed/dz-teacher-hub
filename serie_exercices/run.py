# -*- coding: utf-8 -*-
"""Runner - يشغل generate_pdf.py مع encoding صحيح"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# تعديل print في generate_pdf.py
with open('generate_pdf.py', encoding='utf-8') as f:
    code = f.read()

# استبدال الإيموجي
code = code.replace('print("🔧 توليد الصفحة 1...")', 'print("[1/3] توليد الصفحة الاولى...")')
code = code.replace('print("🔧 توليد الصفحة 2...")', 'print("[2/3] توليد الصفحة الثانية...")')
code = code.replace('print("🔧 توليد الصفحة 3...")', 'print("[3/3] توليد الصفحة الثالثة...")')
code = code.replace('print(f"✅ PDF جاهز: {OUTPUT_PATH}")', 'print("PDF DONE:", OUTPUT_PATH)')

exec(compile(code, 'generate_pdf.py', 'exec'))
