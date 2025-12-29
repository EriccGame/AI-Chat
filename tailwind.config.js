/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#0f172a',
        'chat-surface': '#1e293b',
        'chat-border': '#334155',
        'user-message': '#3b82f6',
        'ai-message': '#64748b',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
