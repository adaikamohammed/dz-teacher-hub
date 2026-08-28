# 📱 دليل نظام التصميم المتجاوب وتجربة الشاشات (Mobile-First Responsive System)

> [!IMPORTANT]
> **مبدأ التصميم الأساسي:** يعمل التطبيق كـ **تطبيق هاتف أصيل (Mobile App)** عند فتحه من الهواتف الذكية، وفي نفس الوقت يتحول بسلاسة فائقة إلى **لوحة عمل مكتبية احترافية واسعة (Desktop Dashboard)** عند فتحه من الحواسيب والشاشات الكبيرة، مع دعم مثالي للوضع الأفقي والعمودي في الأجهزة اللوحية (Tablets).

---

## 📐 1. خريطة نقاط التوقف التجاوبية (Responsive Breakpoints):

```css
/* Mobile Small & Standard */
@media (max-width: 640px) {
  /* Phone View: Bottom Navigation Bar active, Collapsed drawers, 1-column cards */
}

/* Tablet Portrait & Landscape */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet View: Adaptive 2-column layout, compact sidebar, touch-optimized tables */
}

/* Desktop & Laptop */
@media (min-width: 1025px) {
  /* Desktop View: Full sidebar with collapse toggle, zero scrollbar rule, full analytics */
}

/* Ultra-wide Monitors */
@media (min-width: 1536px) {
  /* Ultra-wide: Constrained container max-width to prevent line length exhaustion */
}
```

---

## 🌟 2. مكونات الهواتف الذكية الحصرية (Mobile-First Features):

### أ. شريط التنقل السفلي للهواتف (Bottom Mobile Navigation Bar):
- يثبت في أسفل الشاشة على الهواتف (`position: fixed; bottom: 0; left: 0; right: 0; z-index: 100`).
- يضم 5 أزرار سريعة الوصول بأيقونات واضحة وحجم لمسي مريح (48px height):
  1. **الرئيسية 🏠 (الحضور والمتابعة)**
  2. **مخطط الجلوس 🪑 (تنقيط ومقاعد)**
  3. **دفتر النصوص 📅 (الحصص والدروس)**
  4. **كشف النقاط 📊 (الفروض والمعدلات)**
  5. **القائمة والمزيد ☰ (الواجبات، الوثائق، الإعدادات)**

### ب. شريط التبويبات السريع القابل للتمرير الأفقي (Swipeable Filter Chips):
- أشرطة الأقسام والتبويبات تستخدم `overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;` لضمان تمرير ناعم بدون شريط تمرير قبيح.

### ج. الجداول القابلة للتمرير والتكيف (Responsive Adaptive Tables):
- تحويل الجداول المعقدة على الهواتف إلى **بطاقات مدمجة (Card View)**، مع إتاحة خيار عرض الجدول الأفقي الموسع لمن يفضل ذلك.

---

## 🎨 3. معايير الجمالية البصرية والتجربة الفائقة (Aesthetics & UX):
- **الألوان والتناغم:** استخدام لوحة ألوان ملكية غنية بالأزرق الداكن والأخضر الزمردي والذهبي الفاخر.
- **التصميم في الوضعين (Dark Mode & Light Mode):** دعم كامل ومتقن للتبديل الفوري بين الوضع الفاتح والداكن.
- **الطباعة العربية الفاخرة:** خط `Cairo` للعناوين والنصوص، وخط `Inter` للأرقام والعلامات الحسابية لضمان أقصى درجات الوضوح.
- **اللمس والتفاعل:** تأثيرات ضغط حية (Active feedback / Ripple / Scale transitions) على جميع الأزرار والبطاقات.
