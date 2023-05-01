const colors = require('tailwindcss/colors')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					...colors.rose
				},
				base: {
					...colors.zinc
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
}

module.exports = config
