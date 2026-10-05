/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
            colors: {
                albania: {
                    red: '#E41E20',
                    dark: '#0a0a0a',
                    charcoal: '#1a1a1a',
                    bubbleBot: '#262626'
                }
            },
            animation: {
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    },
    plugins: []
};
