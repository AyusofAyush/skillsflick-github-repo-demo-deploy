# 🌟 Interactive Portfolio Demo

An interactive, single-page portfolio designed to showcase web development skills with smooth animations, reusable components, and a polished user experience. This project is part of the Session 10 hands-on module on version control, deployment, and web hosting.

---

## 🔍 Overview

This static site demonstrates how to combine semantic HTML, modern CSS, and vanilla JavaScript enhancements into a professional developer portfolio. It includes dynamic project cards, animated counters, skill progress indicators, modal dialogs, and accessibility-conscious navigation.

---

## ✨ Key Features

- **Responsive layout** that adapts across desktop, tablet, and mobile breakpoints.
- **Animated hero and counters** powered by CSS transitions and scroll-triggered JavaScript.
- **Filterable project gallery** with modal detail views and external action buttons.
- **Progressive enhancement touches** such as smooth scrolling, sticky navigation, and back-to-top interactions.
- **User feedback system** featuring notifications, loading screen, and dialog overlays.
- **Modular JS architecture** split into focused utilities (`dynamic-content`, `modal`, `smooth-scroll`).

---

## 🗂️ Project Structure

```text
deploy-portfolio/
├── index.html
├── css/
│   ├── animations.css
│   └── styles.css
├── js/
│   ├── dynamic-content.js
│   ├── modal.js
│   └── smooth-scroll.js
└── README.md
```

- `index.html` – Main entry point with semantic sections for navigation, hero, about, projects, skills, and contact.
- `css/` – Core styling (`styles.css`) and reusable animation presets (`animations.css`).
- `js/` – Modular scripts handling content injection, modal orchestration, and scroll behaviours.

---

## 🛠️ Tech Stack

- **HTML5** for semantic structure and accessibility.
- **CSS3** with custom properties, flexbox, grid, and keyframe animations.
- **Vanilla JavaScript (ES6+)** for DOM manipulation, interaction handling, and stateful UI patterns.

No external build tools or package managers are required—everything runs natively in the browser.

---

## 🚀 Getting Started Locally

1. **Clone or download** this folder to your machine.
2. Open `index.html` directly in a modern browser, or serve the directory via a lightweight HTTP server for a more realistic environment.

**Optional local server (recommended):**

```bash
npx serve .
```

This command launches a temporary server (default at `http://localhost:3000`) and handles CORS-friendly asset loading.

---

## 🌐 Deploying to GitHub Pages

1. Create a new GitHub repository (public) and push the contents of `deploy-portfolio/` to the `main` branch.
2. In the repository, navigate to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**, pick the `main` branch, and set the root (`/`) directory.
4. Save the settings—GitHub Pages will publish the site at `https://<your-username>.github.io/<repository-name>/`.
5. (Optional) Configure a custom domain or enforce HTTPS directly from the same settings page.

For versioned updates, commit and push changes to `main`; GitHub Pages redeploys automatically.

---

## 🧩 Customisation Ideas

- Update the project cards in `js/dynamic-content.js` to reflect your real portfolio work.
- Swap hero images, background gradients, or accent colours inside `css/styles.css`.
- Extend the skills section with additional categories or proficiency indicators.
- Integrate analytics or contact form services (e.g., Netlify Forms) if you plan a production launch.

---

## ⚠️ Demo Repository Note

For demonstration purposes, the `.git` directory in this sample project will be removed before distribution so the folder can be copied or re-initialised without history conflicts. Feel free to do the same when sharing your own demo—just run `rm -rf .git` inside the project directory and then initialise a fresh repository when needed.

---

## 🤝 Acknowledgements

- Icons provided via Font Awesome (loaded through CDN in `index.html`).
- Imagery and content placeholders curated for the SkillsFlick web development series.

Happy building and deploying! 🚀
