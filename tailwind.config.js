/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontSize: {
				'3xl': '36px'
			},

			screens: {
				'bp-420px': '420px',
				'bp-900px': '900px',
				'bp-850px': '850px',
				'bp-700px': '700px',
				'bp-1050px': '1050px'
			},

			colors: {
				primary: '#143164',
				'primary-hover': '#435A83',
				secondary: '#206FC9',
				accent: '#3DC2EE',
				'accent-hover': '#D2E2F4',
				'accent-light': '#E9F7FD',
				'accent-dark': '#2BA6CE',
				yellow: '#FFBB12',
				orange: {
					10: '#FFF0E9',
					20: '#FFE1D2',
					40: '#FFC3A5',
					60: '#FFA679',
					100: '#FF6A1F'
				},
				ivory: '#FFF4DE',
				darkGray: '#424242',
				gray: {
					90: '#656F78',
					70: '#8C9AA5',
					50: '#BFC7CD',
					30: '#D9DFE4',
					10: '#ECF0F4'
				},
				blue: {
					10: '#E9F1FA',
					20: '#D2E2F4'
				},
				white: '#FFFFFF',
				white80: '#FCFCFC',
				white50: '#F6F6F6',
				offwhite: '#fcfcfc',

				fontFamily: {
					noto: "'Noto-Sans', Inter"
				}
			}
		},
		plugins: []
	}
};
