/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    DEFAULT: '#064e3b',
                    900: '#064e3b',
                },
                neon: {
                    green: '#a3e635',
                },
                vibrant: {
                    orange: '#f97316',
                }
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            }
        },
    },
    plugins: [],
}
