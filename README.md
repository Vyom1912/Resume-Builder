# 📄 Resume Builder — LaTeX-style

A resume builder with a **LaTeX-inspired editor**: fill in your details on the left and watch a clean, print-ready résumé compile live on the right. Download it as a PDF when you're done.

> *"A document you write, not a form you fill."*

## ✨ Features

- **Live preview** that re-renders as you type
- Sections for personal info, social links, summary, **experience, projects, education, skills and certifications**
- Add or remove as many entries as you need in each section
- Optional **profile photo** upload
- **Autosave** — your draft is stored in localStorage and restored on reload
- **Download as PDF** via the browser's print dialog
- **Clear all** to start a blank document
- User input is HTML-escaped before rendering

## 🛠️ Built With

- HTML5 (`<template>` elements for repeatable entries)
- CSS3 (print styles for PDF export)
- JavaScript (Vanilla, localStorage, FileReader)
- Google Fonts — EB Garamond, IBM Plex Sans, IBM Plex Mono

## 📁 Project Structure

```
13 resume builder/
├── index.html      # Editor, preview and entry templates
├── style.css
├── script.js       # Compile, autosave, photo and print logic
└── icon.png
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/vyom1912/<repository-name>.git
   ```
2. Open `index.html` in your browser — no build step or installation needed.

> Tip: For the best experience, use the **Live Server** extension in VS Code.

## 🖨️ Exporting to PDF

Click **Download PDF** and choose **Save as PDF** as the printer in the print dialog.

## 👤 Author

**Vyom Patel** — [GitHub @vyom1912](https://github.com/vyom1912)

If you like this project, consider giving it a ⭐ on GitHub!
