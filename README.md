Miles2Go AI

Miles2Go AI is an intelligent travel planning web application built using Next.js.
It helps users plan personalized trips through AI-powered recommendations, smart pricing, and vendor integration — creating a seamless experience for both travelers and local service providers.

🚀 Getting Started
1. Install Dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install

2. Run the Development Server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Then, open http://localhost:3000
 in your browser.

🔑 Environment Variables

Create a .env.local file in the root directory and add the following environment variables:

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Convex DB
CONVEX_DEPLOYMENT=your_convex_deployment_url

# Other Config (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000