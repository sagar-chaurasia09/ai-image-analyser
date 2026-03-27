# AI Image Analyzer with Excel Export 🚀

A complete, production-ready MERN stack web application that allows users to upload multiple images (up to 100), analyzes them using AI (OpenAI Vision), displays the results in a beautiful modern UI, and exports them to an Excel file.

## 📁 Folder Structure

```
ai-image-analyzer/
├── backend/
│   ├── models/
│   │   └── ImageResult.js
│   ├── routes/
│   │   └── images.js
│   ├── services/
│   │   └── openai.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageCard.jsx
│   │   │   └── UploadZone.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🛠️ Step-by-Step Setup Instructions

### Prerequisites
1. Ensure you have **Node.js** (v18+) installed.
2. Ensure you have **MongoDB** running locally or a MongoDB Atlas URI.
3. Obtain an **OpenAI API Key**.

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd "Desktop/ai image/backend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Rename `.env.example` to `.env`.
   - Open `.env` and configure your keys:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ai-image-analyzer
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *You should see "火箭 Server is running on port 5000" and "✅ Connected to MongoDB".*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd "Desktop/ai image/frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

## 📦 Features & Functionality
- **Mass Image Upload**: Upload up to 100 images seamlessly using the built-in React dropzone.
- **AI Processing**: Images are processed directly via buffers (using Multer MemoryStorage) and sent securely to OpenAI's GPT-4 Vision model without saving files to disk.
- **Beautiful Results**: Dark-mode compatible UI using TailwindCSS, featuring a staggered grid layout and glowing micro-interactions.
- **Excel Export**: Download an instant generated Excel (`.xlsx`) file containing all analyses across the database history.
- **Graceful Error Handling**: Catch specific Multer limits, OpenAI token issues, and database outages in the UI.

## ⚙️ How AI Integration Works (API Flow)
1. User drops images into `UploadZone.jsx`.
2. Frontend creates a `FormData` payload and POSTs to `/api/images/upload`.
3. Express server intercepts via `multer`, validating file types and max total count (100).
4. `services/openai.js` receives the base64 buffered image, wraps it in the payload structure for `gpt-4-vision-preview`, and queries OpenAI.
5. The result is returned, saved natively to MongoDB along with image metadata.
6. Frontend receives the Array of Results, displays confetti for a WOW factor, and updates the grid immediately.
