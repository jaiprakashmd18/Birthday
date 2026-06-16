# 🌟 Happy 20th Birthday Meenu — Cinematic Birthday Experience

A world-class, award-worthy interactive birthday website built with Next.js, Three.js, Framer Motion, and GSAP.

## ✨ Features

| Section | Description |
|---|---|
| 🚀 **Loading Screen** | Cinematic "M20" logo with space particle animation |
| 🌌 **Hero Section** | Full 3D space scene with animated age counter |
| 🪐 **Memory Universe** | 5 interactive planets — each opens a memory portal |
| ⏳ **Timeline** | Scroll-animated journey through 2006→2026 |
| 🖼️ **Photo Gallery** | Holographic 3D-tilt photo frames |
| 💌 **Birthday Letter** | Typewriter animation with floating hearts |
| ✨ **Wishes** | Glass-morphism wish cards with 3D hover |
| 🌀 **Surprise Portal** | Magic portal with particle explosion |
| 🎂 **Birthday Cake** | 3D cake with 20 candles + blow-out interaction |
| 🎆 **Fireworks Show** | Canvas fireworks — click to ignite! |
| 🎵 **Audio** | Web Audio API ambient cinematic music |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

```bash
npx vercel --prod
```

Or connect this repo to [vercel.com](https://vercel.com) for automatic deploys.

## 🖼️ Adding Photos

Replace photo placeholders in `src/components/PhotoGallery.tsx`:
- Replace gradient placeholders with `<Image src="..." />` components
- Upload photos to `public/photos/` directory

## 🎨 Customizing

- **Colors**: Edit `tailwind.config.ts` color palette
- **Content**: Update text in each component file
- **Music**: Replace Web Audio synth in `AudioController.tsx` with an audio file

## 🛠️ Tech Stack

- **Next.js 15** — App Router, SSR, optimization
- **React 18** — Concurrent features
- **Three.js + R3F** — 3D scenes and WebGL
- **Framer Motion** — Fluid animations
- **Tailwind CSS** — Utility-first styling
- **Web Audio API** — Ambient cinematic music

---

Made with 💜 for Meenu's 20th Birthday — August 9, 2026
