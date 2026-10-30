# -*- coding: utf-8 -*-
"""
سلسلة تمارين — العمليات على الأعداد الطبيعية والكسور
الأستاذ: محمد عدايكة | المستوى: 2 متوسط
PDF عالي الدقة مع صور مقصوصة ومباشرة وتنسيق RTL احترافي
"""

import os
import sys
import io
from PIL import Image

import arabic_reshaper
from bidi.algorithm import get_display

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── تسجيل الخطوط ──────────────────────────────────────────────────────────
FONTS_DIR = r"C:\Windows\Fonts"
def register_font(name, filename):
    path = os.path.join(FONTS_DIR, filename)
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name, path))
        return True
    return False

register_font('TradArabic', 'trado.ttf')

def ar(text):
    """تحويل النص العربي إلى تمثيل صحيح بصرياً لـ RTL"""
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

# ── الأبعاد والألوان ────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 1.25 * cm
CONTENT_W = PAGE_W - 2 * MARGIN

HEADER_BLUE    = HexColor('#1A5276') # أزرق داكن احترافي
HEADER_BG      = HexColor('#EBF5FB') # خلفية الترويسة الهادئة
BORDER_GRAY    = HexColor('#BDC3C7')
LIGHT_BOX_BG   = HexColor('#F8F9F9')

FONT_AR        = 'TradArabic'
FONT_MATH      = 'Helvetica'
FONT_SIZE_BODY = 10.5
FONT_SIZE_EX   = 11.5

OUTPUT_PATH = r"G:\Al-Shafi-i-Group-main\Math site\serie_exercices\serie_exercices_v2.pdf"
FIG_DIR     = r"G:\Al-Shafi-i-Group-main\Math site\serie_exercices"

# ═══════════════════════════════════════════════════════════════════════════
#  الدوال المساعدة للرسم
# ═══════════════════════════════════════════════════════════════════════════

def draw_header(c, y_top):
    """رسم رأس الصفحة الرسمي الأنيق"""
    h = 2.05 * cm
    x0, y0 = MARGIN, y_top - h

    # خلفية الترويسة
    c.setFillColor(HEADER_BG)
    c.rect(x0, y0, CONTENT_W, h, fill=1, stroke=0)
    # إطار خارجي
    c.setStrokeColor(HEADER_BLUE)
    c.setLineWidth(1.4)
    c.rect(x0, y0, CONTENT_W, h, fill=0, stroke=1)

    # خط فاصل وسطي
    sep_y = y0 + 0.68 * cm
    c.setLineWidth(0.6)
    c.setStrokeColor(HexColor('#85C1E9'))
    c.line(x0, sep_y, x0 + CONTENT_W, sep_y)

    # ── الصف العلوي ──────────────────────────────────────
    top_mid_y = sep_y + (h - 0.68*cm)/2 - 0.12*cm

    # الأستاذ : محمد عدايكة (يمين)
    c.setFont(FONT_AR, 11)
    c.setFillColor(black)
    c.drawRightString(x0 + CONTENT_W - 0.3*cm, top_mid_y, ar("الأستاذ : محمد عدايكة"))

    # العنوان (وسط)
    c.setFont(FONT_AR, 12.5)
    c.setFillColor(HEADER_BLUE)
    c.drawCentredString(x0 + CONTENT_W/2, top_mid_y, ar("سلسلة العمليات على الأعداد الطبيعية والكسور"))

    # المستوى (يسار)
    c.setFont(FONT_AR, 11)
    c.setFillColor(black)
    c.drawString(x0 + 0.3*cm, top_mid_y, ar("المستوى : 2 متوسط"))

    # ── الصف السفلي ──────────────────────────────────────
    low_y = y0 + 0.22 * cm
    c.setFont(FONT_AR, 10)
    # اسم ولقب الطالب مع نقاط
    c.drawRightString(x0 + CONTENT_W - 0.3*cm, low_y, ar("اسم ولقب الطالب : ........................................................................"))
    # الفوج مع نقاط
    c.drawString(x0 + 0.3*cm, low_y, ar("الفوج : ..................................."))

    return y0 - 0.35 * cm


def draw_ex_title(c, x_right, y, num):
    """رسم عنوان التمرين : تمرين رقم X : بدون أي دائرة وبشكل واضح"""
    c.setFont(FONT_AR, FONT_SIZE_EX)
    c.setFillColor(HEADER_BLUE)
    title_text = f"تمرين رقم {num} :"
    c.drawRightString(x_right, y, ar(title_text))
    c.setFillColor(black)
    return y - 0.44 * cm


def ar_line(c, text, x_right, y, font_size=FONT_SIZE_BODY, color=black):
    """كتابة سطر نص عربي من اليمين"""
    c.setFont(FONT_AR, font_size)
    c.setFillColor(color)
    c.drawRightString(x_right, y, ar(text))
    return y - (font_size + 3.5) * 0.035278 * cm


def math_line(c, formula, x_center, y, font_size=10.5):
    """كتابة معادلة رياضية LTR في الوسط"""
    c.setFont(FONT_MATH, font_size)
    c.setFillColor(black)
    c.drawCentredString(x_center, y, formula)
    return y - (font_size + 4) * 0.035278 * cm


def draw_fraction(c, num, den, x_center, y_mid, font_size=10):
    """رسم كسر عمودي بسيط وأنيق"""
    c.setFont(FONT_MATH, font_size)
    c.setFillColor(black)
    nw = c.stringWidth(num, FONT_MATH, font_size)
    dw = c.stringWidth(den, FONT_MATH, font_size)
    fw = max(nw, dw) + 3
    # البسط
    c.drawCentredString(x_center, y_mid + 0.22*cm, num)
    # خط الكسر
    c.setLineWidth(0.7)
    c.line(x_center - fw/2, y_mid + 0.12*cm, x_center + fw/2, y_mid + 0.12*cm)
    # المقام
    c.drawCentredString(x_center, y_mid - 0.22*cm, den)


def draw_image_fig(c, img_name, x_center, y_top, max_w, max_h=None):
    """رسم صورة مقصوصة مع الحفاظ على أبعادها تماماً وبشكل متناسق"""
    img_path = os.path.join(FIG_DIR, img_name)
    if not os.path.exists(img_path):
        return y_top
    im = Image.open(img_path)
    w_px, h_px = im.size
    aspect = h_px / w_px

    target_w = max_w
    target_h = target_w * aspect
    if max_h and target_h > max_h:
        target_h = max_h
        target_w = target_h / aspect

    x = x_center - target_w / 2
    y = y_top - target_h
    c.drawImage(img_path, x, y, width=target_w, height=target_h, preserveAspectRatio=True, mask='auto')
    return y - 0.25 * cm


def draw_qr_box(c):
    """مربع فارغ صغير للـ QR في أسفل الصفحة بدون أي نص"""
    bw = 2.1 * cm
    bx = PAGE_W/2 - bw/2
    by = MARGIN + 0.15*cm
    c.setStrokeColor(HexColor('#95A5A6'))
    c.setLineWidth(0.9)
    c.rect(bx, by, bw, bw, fill=0, stroke=1)


def draw_approx_table(c, x, y, w, expr, precision):
    """جدول التقريب المنظم والأنيق"""
    h_top = 0.65 * cm
    h_sub = 0.55 * cm
    h_val = 0.85 * cm
    total_h = h_top + h_sub + h_val

    # أعمدة: الحاصل (30%)، للوحدة زيادة ونقصان (35%)، للدقة زيادة ونقصان (35%)
    cols = [w * 0.28, w * 0.18, w * 0.18, w * 0.18, w * 0.18]
    xs = [x]
    for cw in cols:
        xs.append(xs[-1] + cw)

    c.setLineWidth(0.6)
    c.setStrokeColor(HexColor('#34495E'))

    # صف الرأس الرئيسي
    c.setFillColor(HexColor('#D4E6F1'))
    # الحاصل
    c.rect(xs[0], y - h_top - h_sub, cols[0], h_top + h_sub, fill=1, stroke=1)
    # قيمة مقربة للوحدة
    c.rect(xs[1], y - h_top, cols[1] + cols[2], h_top, fill=1, stroke=1)
    # قيمة مقربة للدقة
    c.rect(xs[3], y - h_top, cols[3] + cols[4], h_top, fill=1, stroke=1)

    c.setFont(FONT_AR, 8.5)
    c.setFillColor(black)
    c.drawCentredString(xs[0] + cols[0]/2, y - (h_top + h_sub)/2 - 0.08*cm, ar("الحاصل"))
    c.drawCentredString(xs[1] + (cols[1]+cols[2])/2, y - h_top/2 - 0.08*cm, ar("قيمة مقربة للوحدة"))
    c.drawCentredString(xs[3] + (cols[3]+cols[4])/2, y - h_top/2 - 0.08*cm, ar(f"قيمة المقربة إلى {precision}"))

    # صف الرأس الفرعي (بالزيادة / بالنقصان)
    sub_y = y - h_top
    for i in range(1, 5):
        c.setFillColor(HexColor('#EAF2F8'))
        c.rect(xs[i], sub_y - h_sub, cols[i], h_sub, fill=1, stroke=1)
        c.setFont(FONT_AR, 7.5)
        c.setFillColor(black)
        lbl = "بالزيادة" if i % 2 == 1 else "بالنقصان"
        c.drawCentredString(xs[i] + cols[i]/2, sub_y - h_sub/2 - 0.08*cm, ar(lbl))

    # صف القيم الفارغ للإجابة
    val_y = sub_y - h_sub
    c.setFillColor(white)
    # خانة الحاصل
    c.rect(xs[0], val_y - h_val, cols[0], h_val, fill=1, stroke=1)
    c.setFont(FONT_MATH, 9.5)
    c.setFillColor(black)
    c.drawCentredString(xs[0] + cols[0]/2, val_y - h_val/2 - 0.08*cm, expr)

    for i in range(1, 5):
        c.setFillColor(white)
        c.rect(xs[i], val_y - h_val, cols[i], h_val, fill=1, stroke=1)

    return val_y - h_val


# ═══════════════════════════════════════════════════════════════════════════
#  الصفحة الأولى (تمارين 1 إلى 9)
# ═══════════════════════════════════════════════════════════════════════════

def build_page1(c):
    y_start = draw_header(c, PAGE_H - MARGIN)

    col_w  = (CONTENT_W - 0.8*cm) / 2
    sep_x  = MARGIN + col_w + 0.4*cm

    # حدود الأعمدة
    x_r_right = MARGIN + CONTENT_W
    x_r_left  = sep_x
    x_r_cen   = (x_r_left + x_r_right) / 2

    x_l_right = sep_x - 0.4*cm
    x_l_left  = MARGIN
    x_l_cen   = (x_l_left + x_l_right) / 2

    # خط عمودي فاصل
    c.setStrokeColor(HexColor('#E5E7E9'))
    c.setLineWidth(0.6)
    c.line(sep_x, y_start, sep_x, MARGIN + 2.7*cm)

    y_r = y_start - 0.25*cm
    y_l = y_start - 0.25*cm

    # ── العمود الأيمن ─────────────────────────────────────

    # تمرين رقم 1
    y_r = draw_ex_title(c, x_r_right, y_r, 1)
    y_r = ar_line(c, "1) احسب العبارات التالية :", x_r_right, y_r)
    y_r = math_line(c, "A = 2,5 + 7,5 + 11", x_r_cen, y_r)
    y_r = math_line(c, "B = 17,2 - 0,8 - 3", x_r_cen, y_r)
    y_r = math_line(c, "C = 14 - 6 + 9 - 1", x_r_cen, y_r)
    y_r = ar_line(c, "2) استنتج ناتج الحساب :", x_r_right, y_r)
    y_r = math_line(c, "A - B + C", x_r_cen, y_r)
    y_r -= 0.25*cm

    # تمرين رقم 2
    y_r = draw_ex_title(c, x_r_right, y_r, 2)
    y_r = ar_line(c, "1) احسب بتمعن العبارات التالية :", x_r_right, y_r)
    y_r = math_line(c, "A = 270 ÷ 27 ÷ 5", x_r_cen, y_r)
    y_r = math_line(c, "B = 54 ÷ 9 × 4,5", x_r_cen, y_r)
    y_r = math_line(c, "C = 3,2 × 5 × 4", x_r_cen, y_r)
    y_r = ar_line(c, "2) استنتج ناتج الحساب :", x_r_right, y_r)
    y_r = math_line(c, "C ÷ A × B", x_r_cen, y_r)
    y_r -= 0.25*cm

    # تمرين رقم 3
    y_r = draw_ex_title(c, x_r_right, y_r, 3)
    y_r = ar_line(c, "- احسب بتمعن العبارات التالية :", x_r_right, y_r)
    y_r = math_line(c, "A = 275 - 25 × 3", x_r_cen, y_r)
    y_r = math_line(c, "B = 63 ÷ 9 - 5", x_r_cen, y_r)
    y_r = math_line(c, "C = 80 - 36 ÷ 8", x_r_cen, y_r)
    y_r = math_line(c, "D = 100 - 7 × 3 + 11", x_r_cen, y_r)
    y_r = math_line(c, "E = 7 + 4 × 10 - 6 ÷ 3", x_r_cen, y_r)
    y_r -= 0.25*cm

    # تمرين رقم 4
    y_r = draw_ex_title(c, x_r_right, y_r, 4)
    y_r = ar_line(c, "- احسب بتمعن العبارات التالية :", x_r_right, y_r)
    y_r = math_line(c, "A = 8 × (0,9 - 0,4)", x_r_cen, y_r)
    y_r = math_line(c, "B = 62 - (7,2 - 5,2) × 3", x_r_cen, y_r)
    y_r = math_line(c, "C = 1 + 15 ÷ (0,6 + 4,4)", x_r_cen, y_r)
    y_r = math_line(c, "D = 5 × (14 - 1,4 × 6)", x_r_cen, y_r)
    y_r = math_line(c, "E = 40 - [4 × (10 - 6) ÷ 4]", x_r_cen, y_r)
    y_r = math_line(c, "F = 15 + 2 × [90 - (16 ÷ 0,2)]", x_r_cen, y_r)
    y_r -= 0.25*cm

    # تمرين رقم 5
    y_r = draw_ex_title(c, x_r_right, y_r, 5)
    y_r = ar_line(c, "أكمل العبارة H بالأعداد المناسبة انطلاقاً من النتيجة", x_r_right, y_r)
    y_r = ar_line(c, "حتى تصل للعبارة الأولى :", x_r_right, y_r)
    y_r = math_line(c, "H = 17 × [5 + 7 × (... - 1)] - 3", x_r_cen, y_r)
    y_r = math_line(c, "H = 17 × [5 + 7 × ...] - 3", x_r_cen, y_r)
    y_r = math_line(c, "H = 17 × [5 + ...] - 3", x_r_cen, y_r)
    y_r = math_line(c, "H = 17 × 19 - 3", x_r_cen, y_r)
    y_r = math_line(c, "H = ... - ...", x_r_cen, y_r)
    y_r = math_line(c, "H = 320", x_r_cen, y_r)
    y_r -= 0.25*cm

    # تمرين رقم 6 (يمين)
    y_r = draw_ex_title(c, x_r_right, y_r, 6)
    y_r = ar_line(c, "ضع القوسين في المكان المناسب لتكون المساواة صحيحة :", x_r_right, y_r)
    y_r = math_line(c, "17 - 4 × 3 = 5", x_r_cen, y_r)
    y_r = math_line(c, "13 + 4 × 2 + 6 = 136", x_r_cen, y_r)

    # ── العمود الأيسر ─────────────────────────────────────

    # تمرين رقم 6 (سبورة)
    y_l = draw_ex_title(c, x_l_right, y_l, 6)
    y_l = ar_line(c, "مسح زميلك بالخطأ العبارة G المكتوبة على السبورة.", x_l_right, y_l)
    y_l = ar_line(c, "أكمل العبارة G بالأعداد المناسبة انطلاقاً من النتيجة", x_l_right, y_l)
    y_l = ar_line(c, "حتى تصل للعبارة الأولى :", x_l_right, y_l)

    # صورة السبورة المقصوصة الأصلية
    y_l = draw_image_fig(c, "fig_ex6_board.png", x_l_cen, y_l - 0.1*cm, col_w * 0.95, 3.8*cm)
    y_l -= 0.25*cm

    # تمرين رقم 7
    y_l = draw_ex_title(c, x_l_right, y_l, 7)
    y_l = ar_line(c, "• قرر 16 تلميذاً من القسم 2AM4 و 7 تلاميذ من قسم 2AM5", x_l_right, y_l)
    y_l = ar_line(c, "تزيين وتغليف طاولتهم، فأحضر كل تلميذ 3 أغلفة ورقية.", x_l_right, y_l)
    y_l = ar_line(c, "- اختر سلسلة العمليات الصحيحة التي تسمح بحساب مجموع", x_l_right, y_l)
    y_l = ar_line(c, "الأغلفة التي تم جمعها :", x_l_right, y_l)

    # خيارات تمرين 7
    c.setFont(FONT_MATH, 10.5)
    c.setFillColor(black)
    c.drawCentredString(x_l_cen - col_w*0.25, y_l, "16 × 7 + 3")
    c.drawCentredString(x_l_cen + col_w*0.25, y_l, "16 × (7 + 3)")
    y_l -= 0.45*cm
    c.drawCentredString(x_l_cen - col_w*0.25, y_l, "16 × 7 × 3")
    c.drawCentredString(x_l_cen + col_w*0.25, y_l, "(16 + 7) × 3")
    y_l -= 0.55*cm

    # تمرين رقم 8
    y_l = draw_ex_title(c, x_l_right, y_l, 8)
    y_l = ar_line(c, "وزّع مشرف التربية على الأساتذة 52 قلماً، حيث أخذ 8 أساتذة", x_l_right, y_l)
    y_l = ar_line(c, "قلمين لكل واحد منهم والباقي قام بتوزيعهم على 12 أستاذاً", x_l_right, y_l)
    y_l = ar_line(c, "بالتساوي.", x_l_right, y_l)
    y_l = ar_line(c, "- اختر السلسلة الصحيحة التي تعبر عن الوضعية ثم احسبها :", x_l_right, y_l)
    y_l = math_line(c, "A = 52 + 8 × 2 ÷ 12", x_l_cen, y_l)
    y_l = math_line(c, "B = (52 - 8 × 2) ÷ 12", x_l_cen, y_l)
    y_l = math_line(c, "C = (52 - 8) × 2 ÷ 12", x_l_cen, y_l)
    y_l -= 0.25*cm

    # تمرين رقم 9
    y_l = draw_ex_title(c, x_l_right, y_l, 9)
    y_l = ar_line(c, "اعطِ كتابة أخرى للكسر بدون خط كسر ثم احسبه :", x_l_right, y_l)
    y_l -= 0.2*cm

    # كسر A و B
    draw_fraction(c, "17 + 3", "6 - 2", x_l_cen - 1.8*cm, y_l, 10.5)
    c.setFont(FONT_MATH, 10.5)
    c.drawString(x_l_cen - 3.0*cm, y_l - 0.05*cm, "A =")
    c.drawString(x_l_cen - 0.8*cm, y_l - 0.05*cm, "+ 11")

    draw_fraction(c, "100 - 30 × 3", "2 + 6 ÷ 2", x_l_cen + 2.2*cm, y_l, 10)
    c.drawString(x_l_cen + 0.6*cm, y_l - 0.05*cm, "B =")

    # مربع QR أسفل الصفحة
    draw_qr_box(c)


# ═══════════════════════════════════════════════════════════════════════════
#  الصفحة الثانية (تمارين 10 إلى 15)
# ═══════════════════════════════════════════════════════════════════════════

def build_page2(c):
    y_start = draw_header(c, PAGE_H - MARGIN)

    col_w  = (CONTENT_W - 0.8*cm) / 2
    sep_x  = MARGIN + col_w + 0.4*cm

    x_r_right = MARGIN + CONTENT_W
    x_r_left  = sep_x
    x_r_cen   = (x_r_left + x_r_right) / 2

    x_l_right = sep_x - 0.4*cm
    x_l_left  = MARGIN
    x_l_cen   = (x_l_left + x_l_right) / 2

    c.setStrokeColor(HexColor('#E5E7E9'))
    c.setLineWidth(0.6)
    c.line(sep_x, y_start, sep_x, MARGIN + 2.7*cm)

    y_r = y_start - 0.25*cm
    y_l = y_start - 0.25*cm

    # ── العمود الأيمن ─────────────────────────────────────

    # تمرين رقم 10
    y_r = draw_ex_title(c, x_r_right, y_r, 10)
    y_r = ar_line(c, "1) اعطِ كتابة أخرى للكسر بدون خط كسر ثم احسبه :", x_r_right, y_r)
    y_r -= 0.15*cm
    draw_fraction(c, "30 - 3", "6 - 2", x_r_cen + 0.5*cm, y_r, 10.5)
    c.setFont(FONT_MATH, 10.5)
    c.drawString(x_r_cen - 1.2*cm, y_r - 0.05*cm, "A =")
    y_r -= 0.65*cm

    y_r = ar_line(c, "2) أراد زميلك حساب الكسر السابق بالآلة الحاسبة فكتبها كالآتي :", x_r_right, y_r)
    # صورة أزرار الآلة الحاسبة الأصلية
    y_r = draw_image_fig(c, "fig_ex10_calc.png", x_r_cen, y_r - 0.05*cm, col_w * 0.9, 0.7*cm)
    y_r = ar_line(c, "فظهرت على الشاشة النتيجة : 2,5", x_r_right, y_r)
    y_r = ar_line(c, "ما هو الخطأ الذي ارتكبه زميلك؟ ضع اللمسات التي يجب", x_r_right, y_r)
    y_r = ar_line(c, "أن يكتبها على الآلة الحاسبة.", x_r_right, y_r)
    y_r -= 0.3*cm

    # تمرين رقم 11
    y_r = draw_ex_title(c, x_r_right, y_r, 11)
    y_r = ar_line(c, "- انقل ثم اتمم ما يلي :", x_r_right, y_r)
    y_r = math_line(c, "8 × (5 + x) = 8 × ... + ... × ...", x_r_cen, y_r)
    y_r = math_line(c, "7b - 5b = ... × (7 - ...)", x_r_cen, y_r)
    y_r = math_line(c, "... × (x - y) = 11 × ... - 11 × ...", x_r_cen, y_r)
    y_r -= 0.3*cm

    # تمرين رقم 12
    y_r = draw_ex_title(c, x_r_right, y_r, 12)
    y_r = ar_line(c, "إليك الشكل :", x_r_right, y_r)
    # صورة المستطيل
    y_r = draw_image_fig(c, "fig_ex12_rect.png", x_r_cen, y_r, col_w * 0.78, 2.3*cm)
    y_r = ar_line(c, "عين من بين العبارات التالية التي تمكنك من حساب محيط هذا المستطيل :", x_r_right, y_r)
    c.setFont(FONT_MATH, 10)
    c.drawCentredString(x_r_cen, y_r, "7 + h × 2    ;    2 × 7 + 2 × h")
    y_r -= 0.45*cm
    c.drawCentredString(x_r_cen, y_r, "7 × h × 2    ;    (7 + h) × 2")
    y_r -= 0.45*cm
    c.drawCentredString(x_r_cen, y_r, "7 + h + 7 + h")
    y_r -= 0.55*cm

    # تمرين رقم 13
    y_r = draw_ex_title(c, x_r_right, y_r, 13)
    y_r = ar_line(c, "إليك الشكل :", x_r_right, y_r)
    # صورة الزاوية
    y_r = draw_image_fig(c, "fig_ex13_angle.png", x_r_cen, y_r, col_w * 0.88, 2.5*cm)
    y_r = ar_line(c, "اكتب سلسلة العمليات التي تسمح بحساب قيس الزاوية AOS ثم احسبها.", x_r_right, y_r)

    # ── العمود الأيسر ─────────────────────────────────────

    # تمرين رقم 14
    y_l = draw_ex_title(c, x_l_right, y_l, 14)
    # صورة شكل المنزل
    y_l = draw_image_fig(c, "fig_ex14_house.png", x_l_cen, y_l, col_w * 0.65, 3.4*cm)
    y_l = ar_line(c, "محيط هذا الشكل : 88 cm", x_l_right, y_l)
    y_l = ar_line(c, "- من بين المساويات التالية حدد التي تمكنك من حساب الطول y ثم احسبه :", x_l_right, y_l)
    c.setFont(FONT_MATH, 10.5)
    c.drawCentredString(x_l_cen, y_l, "4 × 10 - 88     ;     88 ÷ 4 - 10")
    y_l -= 0.45*cm
    c.drawCentredString(x_l_cen, y_l, "4 ÷ (88 - 10)   ;   (88 - 10) ÷ 4")
    y_l -= 0.65*cm

    # تمرين رقم 15
    y_l = draw_ex_title(c, x_l_right, y_l, 15)
    y_l = ar_line(c, "فهرنهايت (F°) هي وحدة قياس درجة الحرارة، وللانتقال إلى وحدة", x_l_right, y_l)
    y_l = ar_line(c, "القياس المئوية (C°) نستعمل برنامج الحساب الآتي :", x_l_right, y_l)
    y_l -= 0.15*cm

    # صندوق خطوات الفهرنهايت
    steps = [
        "نختار درجة حرارة الفهرنهايت",
        "نطرح منها العدد 32",
        "نضرب الناتج في 5",
        "نقسم ما وجدته على 9",
    ]
    box_h = len(steps) * 0.46*cm + 0.35*cm
    box_w = col_w * 0.96
    box_x = x_l_cen - box_w/2
    box_y = y_l - box_h

    c.setFillColor(HexColor('#F4F6F7'))
    c.setStrokeColor(HexColor('#AED6F1'))
    c.setLineWidth(1)
    c.roundRect(box_x, box_y, box_w, box_h, 3*mm, fill=1, stroke=1)

    sy = y_l - 0.28*cm
    for st in steps:
        c.setFont(FONT_AR, 9.5)
        c.setFillColor(black)
        c.drawRightString(box_x + box_w - 0.25*cm, sy, ar("• " + st))
        sy -= 0.46*cm

    y_l = box_y - 0.35*cm
    y_l = ar_line(c, "لاحظ أن في ولاية الأغواط درجة الحرارة تشير إلى 50°F،", x_l_right, y_l)
    y_l = ar_line(c, "كم يقابلها من درجة مئوية (C°)؟", x_l_right, y_l)
    y_l = ar_line(c, "(اكتب سلسلة العمليات التي توضح الكيفية)", x_l_right, y_l)

    # صورة خريطة الأغواط مع الترموميتر
    y_l = draw_image_fig(c, "fig_ex15_laghouat.png", x_l_cen, y_l, col_w * 0.72, 3.2*cm)

    draw_qr_box(c)


# ═══════════════════════════════════════════════════════════════════════════
#  الصفحة الثالثة (تمارين 16 إلى 22)
# ═══════════════════════════════════════════════════════════════════════════

def build_page3(c):
    y_start = draw_header(c, PAGE_H - MARGIN)

    col_w  = (CONTENT_W - 0.8*cm) / 2
    sep_x  = MARGIN + col_w + 0.4*cm

    x_r_right = MARGIN + CONTENT_W
    x_r_left  = sep_x
    x_r_cen   = (x_r_left + x_r_right) / 2

    x_l_right = sep_x - 0.4*cm
    x_l_left  = MARGIN
    x_l_cen   = (x_l_left + x_l_right) / 2

    c.setStrokeColor(HexColor('#E5E7E9'))
    c.setLineWidth(0.6)
    c.line(sep_x, y_start, sep_x, MARGIN + 2.7*cm)

    y_r = y_start - 0.25*cm
    y_l = y_start - 0.25*cm

    # ── العمود الأيمن ─────────────────────────────────────

    # تمرين رقم 16
    y_r = draw_ex_title(c, x_r_right, y_r, 16)
    y_r = ar_line(c, "1) أنجز القسمة العشرية لعدد 76,34 على العدد 1,3", x_r_right, y_r)
    y_r = ar_line(c, "2) انقل ثم أتمم الجدول :", x_r_right, y_r)
    y_r -= 0.15*cm

    # جدول تمرين 16
    tbl_w = col_w * 0.98
    y_r = draw_approx_table(c, x_r_cen - tbl_w/2, y_r, tbl_w, "76,34 ÷ 1,3", "0,01")
    y_r -= 0.4*cm

    # تمرين رقم 17
    y_r = draw_ex_title(c, x_r_right, y_r, 17)
    y_r = ar_line(c, "توجد 32,46 طناً من السلع نريد نقلها بشاحنة سعة حمولتها 5 طن.", x_r_right, y_r)
    # صورة الشاحنة الأصلية
    y_r = draw_image_fig(c, "fig_ex17_truck.png", x_r_cen, y_r, col_w * 0.88, 1.8*cm)
    y_r = ar_line(c, "1) كم عدد الرحلات التي تتنقل فيها الشاحنة لتوصيل هذه الحمولة؟ (وضح الخطوات)", x_r_right, y_r)
    y_r = ar_line(c, "2) انقل ثم اكمل الجدول التالي :", x_r_right, y_r)
    y_r -= 0.15*cm

    # جدول تمرين 17
    y_r = draw_approx_table(c, x_r_cen - tbl_w/2, y_r, tbl_w, "32,46 ÷ 5", "0,1")
    y_r -= 0.25*cm
    y_r = ar_line(c, "3) أعطي حصراً بين عددين طبيعيين متتاليين للحاصل 32,46 ÷ 5.", x_r_right, y_r)
    y_r -= 0.35*cm

    # تمرين رقم 18
    y_r = draw_ex_title(c, x_r_right, y_r, 18)
    y_r = ar_line(c, "- احسب ما يلي مع توضيح الخطوات :", x_r_right, y_r)
    y_r -= 0.2*cm

    # كسور تمرين 18
    draw_fraction(c, "3,5", "55", x_r_cen - 2.8*cm, y_r, 10.5)
    c.setFont(FONT_MATH, 11)
    c.drawString(x_r_cen - 2.1*cm, y_r - 0.05*cm, "+")
    draw_fraction(c, "2,5", "55", x_r_cen - 1.4*cm, y_r, 10.5)
    c.drawString(x_r_cen - 0.7*cm, y_r - 0.05*cm, "  ,  ")
    draw_fraction(c, "4", "5", x_r_cen + 0.3*cm, y_r, 10.5)
    c.drawString(x_r_cen + 1.0*cm, y_r - 0.05*cm, "×")
    draw_fraction(c, "2", "11", x_r_cen + 1.8*cm, y_r, 10.5)
    y_r -= 0.8*cm

    y_r = ar_line(c, "ثم احسب :", x_r_right, y_r)
    c.setFont(FONT_MATH, 10.5)
    c.drawCentredString(x_r_cen, y_r, "4/5 × 2/11  −  (3,5/55 + 2,5/55)")

    # ── العمود الأيسر ─────────────────────────────────────

    # تمرين رقم 19
    y_l = draw_ex_title(c, x_l_right, y_l, 19)
    y_l = ar_line(c, "إليك الكسور التالية : A ، B ، C حيث :", x_l_right, y_l)
    y_l -= 0.2*cm

    # كسور A B C
    draw_fraction(c, "5", "6", x_l_cen - 2.0*cm, y_l, 11)
    c.setFont(FONT_MATH, 10.5)
    c.drawString(x_l_cen - 3.1*cm, y_l - 0.05*cm, "A =")
    draw_fraction(c, "13", "24", x_l_cen, y_l, 11)
    c.drawString(x_l_cen - 1.0*cm, y_l - 0.05*cm, "B =")
    draw_fraction(c, "5", "12", x_l_cen + 2.0*cm, y_l, 11)
    c.drawString(x_l_cen + 1.0*cm, y_l - 0.05*cm, "C =")
    y_l -= 0.8*cm

    y_l = ar_line(c, "1) رتب تصاعدياً الكسور : A ، B ، C", x_l_right, y_l)
    y_l = ar_line(c, "2) احسب : A+B ، B-C ، A×B مع اختزال الناتج إن أمكن.", x_l_right, y_l)
    y_l -= 0.3*cm

    # تمرين رقم 20
    y_l = draw_ex_title(c, x_l_right, y_l, 20)
    y_l = ar_line(c, "الشكل (1) يمثل مربعاً يجاوره المستطيل (2) (وحدة الطول m) :", x_l_right, y_l)
    # صورة الشكل المقصوصة الأصلية
    y_l = draw_image_fig(c, "fig_ex20_shape.png", x_l_cen, y_l, col_w * 0.95, 2.5*cm)
    y_l = ar_line(c, "1) احسب مساحة الشكل الكلية معبراً عنها بكسر.", x_l_right, y_l)
    y_l = ar_line(c, "2) بيّن أن محيط المربع هو عدد طبيعي.", x_l_right, y_l)
    y_l -= 0.3*cm

    # تمرين رقم 21
    y_l = draw_ex_title(c, x_l_right, y_l, 21)
    y_l = ar_line(c, "شرع الحجاج في العودة من البقاع المقدسة إلى أرض الوطن،", x_l_right, y_l)
    y_l = ar_line(c, "فرجع منهم في الفوج الأول 2/7 الحجاج وفي الفوج الثاني 5/21", x_l_right, y_l)
    y_l = ar_line(c, "والفوج الثالث 1/3 من الحجاج.", x_l_right, y_l)

    # صورة الكعبة على اليسار والنص على اليمين
    kaaba_top = y_l
    draw_image_fig(c, "fig_ex21_kaaba.png", x_l_left + 1.2*cm, kaaba_top, 2.3*cm, 2.3*cm)

    # الأسئلة بجانب الكعبة
    c.setFont(FONT_AR, FONT_SIZE_BODY)
    c.drawRightString(x_l_right, kaaba_top - 0.4*cm, ar("1) ما هو أصغر فوج من الحجاج؟"))
    c.drawRightString(x_l_right, kaaba_top - 1.0*cm, ar("2) هل كانت الرحلات كافية لرجوع"))
    c.drawRightString(x_l_right, kaaba_top - 1.5*cm, ar("كل الحجاج؟ علّل."))
    y_l = kaaba_top - 2.5*cm

    # تمرين رقم 22
    y_l = draw_ex_title(c, x_l_right, y_l, 22)
    y_l = ar_line(c, "قام سائق شاحنة لنقل البنزين بإفراغ محتوى صهريجه في ثلاث", x_l_right, y_l)
    y_l = ar_line(c, "محطات كالآتي :", x_l_right, y_l)
    y_l -= 0.1*cm

    stations = [
        "المحطة الأولى : أفرغ 4/15 من الصهريج",
        "المحطة الثانية : أفرغ 2/5 من الصهريج",
        "المحطة الثالثة : أفرغ ما بقي من الصهريج",
    ]
    st_box_h = len(stations) * 0.44*cm + 0.3*cm
    st_box_w = col_w * 0.96
    st_box_x = x_l_cen - st_box_w/2
    st_box_y = y_l - st_box_h

    c.setFillColor(LIGHT_BOX_BG)
    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.8)
    c.roundRect(st_box_x, st_box_y, st_box_w, st_box_h, 2.5*mm, fill=1, stroke=1)

    sy = y_l - 0.25*cm
    for st in stations:
        c.setFont(FONT_AR, 9)
        c.setFillColor(black)
        c.drawRightString(st_box_x + st_box_w - 0.2*cm, sy, ar("• " + st))
        sy -= 0.44*cm

    y_l = st_box_y - 0.3*cm
    y_l = ar_line(c, "1) ما هي المحطة التي أُفرغ فيها البنزين أكثر؟ برر.", x_l_right, y_l)
    y_l = ar_line(c, "2) إذا علمت أن حجم البنزين المملوء في الصهريج هو 4800 L،", x_l_right, y_l)
    y_l = ar_line(c, "فأحسب حجم البنزين المفرّغ في كل محطة.", x_l_right, y_l)

    draw_qr_box(c)


# ═══════════════════════════════════════════════════════════════════════════
#  التنفيذ
# ═══════════════════════════════════════════════════════════════════════════

def main():
    c = canvas.Canvas(OUTPUT_PATH, pagesize=A4)
    c.setTitle("سلسلة العمليات على الأعداد الطبيعية والكسور")
    c.setAuthor("محمد عدايكة")

    print("[1/3] Generating Page 1...")
    build_page1(c)
    c.showPage()

    print("[2/3] Generating Page 2...")
    build_page2(c)
    c.showPage()

    print("[3/3] Generating Page 3...")
    build_page3(c)
    c.showPage()

    c.save()
    print("PDF SUCCESSFULLY GENERATED:", OUTPUT_PATH)

if __name__ == '__main__':
    main()
