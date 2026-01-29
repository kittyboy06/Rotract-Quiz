/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#050505',
                'neon-red': '#ff0909',
                'dark-gray': '#1a1a1a',
            },
            fontFamily: {
                serif: ['"Libre Baskerville"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'flicker': 'flicker 2s linear infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
                        opacity: '1',
                    },
                    '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
                        opacity: '0.4',
                    },
                },
            },
            boxShadow: {
                'neon': '0 0 5px #ff0909, 0 0 10px #ff0909, 0 0 20px #ff0909',
                'neon-strong': '0 0 10px #ff0909, 0 0 30px #ff0909, 0 0 50px #ff0909',
            },
            dropShadow: {
                'neon': '0 0 5px #ff0909',
            }
        },
    },
    plugins: [],
}
