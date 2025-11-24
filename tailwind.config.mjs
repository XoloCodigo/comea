/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', // Permite activar el modo oscuro manualmente con la clase 'dark'
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['DM Sans', 'sans-serif'],
			},
			colors: {
				comea: {
					main: '#0F2E4A', // Azul oscuro institucional
					light: '#1E4B75',
					accent: '#F2C744', // Dorado
					tech: '#0EA5E9', // Cian tecnológico
				},
				dark: {
					bg: '#0B1120',
					card: '#162032',
				}
			},
			backgroundImage: {
				'hero-pattern': "linear-gradient(to right bottom, rgba(15, 46, 74, 0.9), rgba(11, 17, 32, 0.95)), url('https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
			},
            animation: {
				'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
			},
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            }
		},
	},
	plugins: [],
}