const colors = require('tailwindcss/colors')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					...colors.amber
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
}

module.exports = config
