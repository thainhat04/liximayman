# Red Envelope Frontend

Modern React application for creating and sharing red envelopes.

## Features

- 🧧 Create multiple red envelopes with custom amounts
- 🎨 Choose from 6 beautiful envelope designs
- 🔗 Generate shareable public links
- ✏️ Edit envelopes with creator token
- 📱 Fully responsive design
- 🎉 Beautiful Lunar New Year theme

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Pages

- `/` - Create new red envelope
- `/view/:id` - View red envelope (public)
- `/edit/:id?token=TOKEN` - Edit red envelope (creator only)
