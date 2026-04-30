# Assignment 01 — Persona-Based AI Chatbot (Scaler Academy)

This is a persona-based AI chatbot built for the Scaler Academy Prompt Engineering module. It allows you to chat with three distinct personalities: Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra.

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS, Lucide React
- Backend: Next.js Route Handlers
- LLM API: Google Gemini API (`@google/generative-ai`)

## Project Structure
- `src/app/page.tsx`: The main user interface with the persona switcher, suggestion chips, and responsive chat container.
- `src/app/api/chat/route.ts`: The backend endpoint handling the Gemini AI prompt engineering and inference generation.
- `prompts.md`: A detailed record of the exact system prompts used, along with the logic and design decisions for each prompt.
- `reflection.md`: A 300+ word reflection covering GIGO principles and project learnings.
- `.env.example`: Template for required environment variables.

## Setup Instructions

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repo-url>
   cd scaler-persona-chatbot
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Create the missing environment variables file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your valid Google Gemini API Key: `GEMINI_API_KEY="..."`

4. Run the development server locally:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Features Delivered
- Three distinct Scaler Academy personas.
- Detailed prompt engineering including Few-Shot examples, Chain-of-Thought, Context, and Constraints.
- Persona switcher, intelligent quick-reply chips, responsive UI, loader states.
- Error handling on API failure.
- No hardcoded API keys.
