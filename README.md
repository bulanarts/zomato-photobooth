# 🍅 Zomato Photobooth
A fun, browser-based photobooth web app where you can take photos, add stickers, apply filters, and download your photo strip. Built with plain HTML, CSS, and JavaScript — no frameworks needed.

**[👉 Try it live here!](https://bulanarts.github.io/zomato-photobooth)**


---

## ✨ Features
- 📸 Take two photos via webcam (with countdown timer)
- 🖼️ Choose a frame for your photo strip
- 🎨 Apply filters (Sepia, Black & White, or none)
- 🌟 Add draggable stickers to your photo
- 💾 Download your finished photo strip
- 📁 Or upload your own photos instead of using the camera

---

## 📁 Project Structure
```
your-project/
│
├── index.html              ← Landing page
├── camera.html             ← Camera/capture page
├── upload.html             ← Upload your own photo page
├── finish.html             ← Sticker editing & download page
│
├── Stylesheets/
│   ├── landing.css
│   ├── camera.css
│   └── finish.css
│
├── Javascript/
│   ├── landing.js
│   ├── camera.js
│   ├── upload.js
│   └── finish.js
│
└── Assets/
    ├── tomatoframe-01.png  ← Photo strip frame
    ├── tomatoframe-02.png  ← Alternative frame
    ├── sticker_star1.png   ← Sticker images
    ├── sticker_heart.png
    ├── ... (all your sticker PNGs)
    └── keranjang.png       ← Background image
```

---

## 🚀 How to Deploy (GitHub Pages) — Step by Step

### Step 1: Create a GitHub Account
Go to [github.com](https://github.com) and sign up for a free account if you don't have one.

### Step 2: Create a New Repository
1. Click the **+** icon (top right) → **New repository**
2. Give it a name (e.g. `my-photobooth`)
3. Set it to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 3: Upload Your Files
**Option A — via browser (easiest for beginners):**
1. Open your new repo on GitHub
2. Click **Add file** → **Upload files**
3. Drag and drop your entire project folder
4. Click **Commit changes**

**Option B — via Git (for future updates):**
```bash
git init
git add .
git commit -m "first upload"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. Scroll down to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set branch to **main**, folder to **/ (root)**
5. Click **Save**

### Step 5: Get Your Live URL
Wait ~1-2 minutes, then refresh the Settings → Pages page. You'll see:
> 🎉 Your site is live at `https://your-username.github.io/your-repo-name`

**Copy this URL and paste it** into the `Try it live here!` link at the top of this README.

---

## 🔄 How to Update Your Site
After your first deploy, updating is simple:
1. Edit your files locally
2. Go to your repo → **Add file** → **Upload files** (or use Git)
3. Upload the changed files, commit
4. GitHub Pages updates automatically within ~1-2 minutes ✅

No lockdowns, no limits — you can update as many times as you want.

---

## 🛠️ How to Customize

### Change the frame
Replace `Assets/tomatoframe-01.png` with your own PNG frame image (same size recommended: 1176x1470px). Update the filename in `camera.js`:
```js
let currentFrame = 'Assets/your-frame-name.png';
```

### Add new stickers
1. Add your PNG sticker file to `Assets/`
2. Add a button in `finish.html`:
```html
<button id="addMySticker" class="sticker-btn mysticker-btn">My Sticker</button>
```
3. Add the background image in `finish.css`:
```css
.mysticker-btn { background-image: url("../Assets/my-sticker.png"); }
```
4. Add the click listener in `finish.js`:
```js
document.getElementById('addMySticker').addEventListener('click', () => addSticker('Assets/my-sticker.png'));
```

### Change colors
All colors are in the `:root` block at the top of each CSS file:
```css
:root {
  --tomato: rgb(210,31,0);   /* main button color */
  --green: rgb(35,84,20);    /* home button */
  --yellow: rgb(244,230,4);  /* download button */
  --white: #f2f2f2;          /* background */
}
```

### Change background image
Replace `Assets/keranjang.png` with your own image, then update in CSS:
```css
background-image: url('/your-path/your-image.png');
```

---

## ⚠️ Important Notes

### Camera requires HTTPS
`getUserMedia()` (camera access) only works on:
- `https://` URLs (GitHub Pages gives you this for free ✅)
- `localhost` (for local testing)

It will **not** work if you just open the HTML file directly from your desktop (`file://`). You need to either deploy it or run a local server.

### Local testing (optional)
If you want to test locally before deploying, install Node.js then run:
```bash
npx serve .
```
Then open `http://localhost:3000` in your browser.

### Photos stay private
Photos are never uploaded to any server. Everything happens in your browser using the Canvas API and `localStorage` — photos are processed and stored locally only.

---

## 🧩 Tech Stack
| Technology | What it does |
|---|---|
| HTML | Page structure |
| CSS | Styling, animations, layout |
| JavaScript | Camera, canvas drawing, stickers, filters |
| Canvas API | Drawing photos, stickers, and frames |
| localStorage | Passing photo data between pages |
| getUserMedia API | Accessing the webcam |

No libraries, no frameworks, no build tools needed. Just plain files.

---

## 💡 Tips for Beginners
- **Use VS Code** as your code editor — it's free and shows errors as you type
- **Right-click → Inspect** in your browser to see CSS changes live and debug JS errors in the Console tab
- **Start small** — get the camera working first before adding stickers/filters
- **File paths matter** — if an image doesn't load, check that the path in HTML/CSS/JS matches exactly where the file is (including capitalization)
- **`px` vs `rem`** — `px` is fixed pixels, `rem` is relative to the root font size (usually 16px). Either works; `rem` scales better across screen sizes

---

## 📄 License
Feel free to use, modify, and share this project. Credit appreciated but not required. 🍅
