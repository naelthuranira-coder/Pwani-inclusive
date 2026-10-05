PWANI INCLUSIVE - how to use
1. Unzip, open index.html in any browser (no server needed).
2. Pages (10 .html files): index, about, programs, impact, blog, post, volunteer, donate, contact, admin.
   Each page holds its own real HTML (header, content, forms, footer).
3. Files:
   style.css      all styling (colours are variables, so dark mode / high contrast are easy)
   app.js         start-up: one click listener, newsletter form, starts the page
   js/data.js     fixed content: starter data, page order, Swahili dictionary
   js/core.js     helpers, saved data (localStorage), language, text size / contrast / dark mode, speech, image fallback
   js/access.js   Read aloud, Voice, Guide, keyboard shortcuts, touch gestures
   js/pages.js    what each page does (blog search, like, forms, donations, admin)
4. Admin password (demo): admin123. All data is stored in the browser (localStorage).
5. Photos: images/ holds 8 JPEG files (hero, volunteer, health, skills, stories, business, community, culture).
   If one is missing, a built-in illustration is shown instead. See images/README.txt.
6. Accessibility: buttons Read (speak page), Voice (speaks focused items), Guide (step-by-step), SW/EN language, A+/A-, contrast, dark mode.
   Keys: R read, S stop, G guide, L language, V voice. Touch: swipe left/right = next/previous page, double-tap = read page, long-press = stop.
