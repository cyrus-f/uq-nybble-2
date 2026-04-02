# UQ Free Events Viewer

A minimalist React app that displays free events scraped from UQ events data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Features

- Displays free events in a clean card layout
- Responsive design (mobile-friendly)
- Hover effects on cards
- Event information includes title, date, society, category, and free badge
- Minimal, modern UI

## Build

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` folder.

## Project Structure

```
├── index.html              # HTML entry point
├── package.json           # Dependencies
├── vite.config.js         # Vite config
├── free_events.json       # Event data
└── src/
    ├── index.jsx          # React entry point
    ├── App.jsx            # Main app component
    ├── index.css          # Global styles
    ├── App.css            # App layout styles
    ├── components/
    │   └── EventCard.jsx  # Event card component
    └── styles/
        └── EventCard.css  # Event card styles
```
