# ⚡ DevPulse — Modern Developer Hub

A responsive, feature-rich developer workspace and productivity webapp built with Vanilla JavaScript, modern CSS Custom Properties, and HTML5. Zero build step, zero external dependencies, 100% offline-ready, and built for deployment to **GitHub Pages**.

---

## ✨ Features

- 📊 **Productivity Dashboard**: Weekly focus charts powered by HTML5 Canvas, live clock, motivation quotes, and real-time statistics.
- 📋 **Kanban Task Board**: Interactive task manager with drag-and-drop support, priority filters, search, and `localStorage` persistence.
- ⏱️ **Pomodoro Focus Timer**: Customizable work/break cycles, circular animated SVG progress indicator, and Web Audio API synthesized chimes (no audio files needed).
- 🛠️ **Developer Toolbox**:
  - **JSON Formatter & Validator**: Beautify, minify, and catch syntax errors.
  - **Base64 Encoder / Decoder**: Quick conversion with UTF-8 support.
  - **UUID v4 Generator**: Generate and copy standard random UUIDs.
  - **URL Encoder / Decoder**: Safe URL parsing and encoding.
- 🎨 **Projects Showcase**: Filterable portfolio card grid for web projects and demos.
- 🌓 **Dark & Light Mode**: Instant theme switching persisted to user preferences.

---

## 🚀 Live Demo on GitHub Pages

The live site is deployed and accessible at:
👉 **[https://rachel400-git.github.io/my-webapp-test/](https://rachel400-git.github.io/my-webapp-test/)**

---

## 🛠️ GitHub Pages Deployment

This repository supports **two** ways to deploy to GitHub Pages:

### Method 1: GitHub Actions (Automated - Pre-configured)
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to the `main` branch will automatically trigger `.github/workflows/deploy.yml` and publish your site!

### Method 2: Deploy from Branch (Classic)
1. Navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch: `main` and folder: `/ (root)`.
4. Click **Save**. Your site will be live within 1–2 minutes!

---

## 💻 Local Preview

You can open `index.html` directly in any web browser, or use a local static server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

---

## 📄 License

MIT License — feel free to use, modify, and build upon this project!
