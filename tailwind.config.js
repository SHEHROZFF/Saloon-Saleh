/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                salon: {
                    base: 'var(--salon-base)',
                    surface: 'var(--salon-surface)',
                    primary: 'var(--salon-primary)',
                    muted: 'var(--salon-muted)',
                    light: 'var(--salon-light)',
                    accent: 'var(--salon-accent)',
                    golden: 'var(--salon-golden)',
                    'golden-muted': 'var(--salon-golden-muted)',
                },
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Cinzel', 'serif'],
            },
        },
    },
    plugins: [],
};
