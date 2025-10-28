# Tasky - A Simple, Offline-First Task & Time Tracker

Tasky is a modern, lightweight, and offline-first Progressive Web App (PWA) for task and time management. Designed for simplicity and efficiency, it helps you create, manage, and track your daily tasks directly in your browser. With no server required, all your data is stored locally, ensuring privacy and blazing-fast performance, even without an internet connection.

![Tasky Application Screenshot](public/images/homescreen.png)

---

## ✨ Key Features

- **📝 Full Task Management**: Create, edit, delete, and mark tasks as complete with a minimal and intuitive user interface.
- **⏱️ Integrated Time Tracking**: Each task has a built-in timer with start, pause, and stop/reset functionality.
- **🏷️ Flexible Tagging System**: Organize tasks with comma-separated tags. Tags can be managed globally (renamed or deleted) from a central Tag Manager.
- **🚀 Offline-First PWA**: All data is stored locally, making the app fully functional without an internet connection. Install it on your desktop or mobile device for a native, app-like experience.
- **🔍 Powerful Filtering & Search**:
    - Instantly search tasks by title or tag.
    - Filter tasks by status (Pending, In Progress, Paused).
    - Filter tasks by a specific tag.
- **🔃 Advanced Sorting**: Sort your task list by creation date (newest/oldest) or alphabetically by title (A-Z/Z-A).
- **↩️ Undo/Redo**: Never lose a change. Easily undo or redo actions like adding, editing, completing, or deleting tasks.
- **🎨 Dark & Light Mode**: A sleek theme toggle for comfortable viewing in any lighting condition, with your preference saved locally.
- **📤 Data Export**: Export all your tasks to JSON or CSV format for reporting or backup purposes.
- **📱 Responsive Design**: A clean, modern UI that works seamlessly on devices of all sizes.

---

## 🛠️ Technology Stack

- **Frontend**: [React](https://react.dev/) (using Hooks) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling workflow.
- **State Management**: Custom React Hooks for managing tasks, theme, and undo/redo state.
- **Data Storage**: Browser `localStorage` for a local-first, serverless architecture.
- **Offline Caching**: Service Worker API for PWA functionality.
- **Icons**: A custom set of SVG icons for a consistent look and feel.

---

## 🚀 Getting Started

To run Tasky on your local machine, you need to serve the project files using a local web server. Opening the `index.html` file directly from your filesystem will not work correctly due to browser security policies for modern web features like Service Workers.

Here are two simple ways to start a local server:

### Option 1: Using Python (if installed)

1.  Navigate to the project's root directory in your terminal.
2.  Run one of the following commands, depending on your Python version:
    *   **Python 3.x**: `python -m http.server`
    *   **Python 2.x**: `python -m SimpleHTTPServer`
3.  Open your web browser and go to `http://localhost:8000`.

### Option 2: Using Node.js and `serve`

1.  Make sure you have [Node.js](https://nodejs.org/) installed.
2.  Open your terminal in the project's root directory.
3.  Install the `serve` package globally (if you haven't already):
    ```bash
    npm install -g serve
    ```
4.  Start the server:
    ```bash
    serve .
    ```
5.  The terminal will provide a local URL (usually `http://localhost:3000`). Open it in your browser.

### Installing as a PWA

For the best experience, you can install Tasky on your device:
-   **On Desktop**: Look for an install icon in the address bar of your browser (e.g., Chrome, Edge).
-   **On Mobile**: Use the "Add to Home Screen" option in your browser's menu.

This adds a Tasky icon to your desktop or home screen for quick, app-like access.

---

## 🚀 Deploying to GitHub Pages

You can easily deploy Tasky as a live PWA using GitHub Pages.

1.  **Push to GitHub**: Make sure your code is pushed to a GitHub repository.
2.  **Enable GitHub Pages**:
    - In your repository, go to **Settings > Pages**.
    - Under "Build and deployment", for the "Source", select **Deploy from a branch**.
    - Choose the branch you want to deploy (e.g., `main`).
    - Select the folder `/ (root)` and click **Save**.
3.  **Access Your Site**: GitHub will build and deploy your site. After a few minutes, your Tasky PWA will be available at `https://<your-username>.github.io/<your-repository-name>/`.

*Note: This project is already configured with the necessary relative paths in `index.html`, `index.tsx`, and `service-worker.ts` to work correctly on GitHub Pages.*

---

## 📂 Project Structure

The project is organized into a clear and maintainable structure:

```
/
├── components/         # Reusable React components
│   ├── AddTaskForm.tsx
│   ├── BulkActionBar.tsx
│   ├── ControlBar.tsx
│   ├── FilterControls.tsx
│   ├── Header.tsx
│   ├── Icons.tsx
│   ├── SortMenu.tsx
│   ├── Tag.tsx
│   ├── TagManager.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   └── Timer.tsx
├── hooks/              # Custom hooks for stateful logic
├── utils/              # Utility functions (time formatting, data export)
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # Shared TypeScript type definitions
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── service-worker.ts   # PWA service worker logic
└── README.md           # You are here!
```

---

## 🎨 Branding & Icons

Tasky ships with placeholder icons stored in `public/icons/`:

- `icon-32.png` — favicon for browsers  
- `icon-180.png` — Apple touch icon  
- `icon-192.png` — standard PWA launcher icon  
- `icon-512.png` — large icon used for install banners and maskable icons

Replace each file with your own artwork while keeping the same filenames and dimensions. After updating the assets, run `npm run build` (and redeploy if needed) so the new icons are bundled into `dist/` and precached by the service worker.


---

## 📄 License

This project is licensed under the MIT License.
