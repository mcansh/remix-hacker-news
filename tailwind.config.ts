import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Verdana", "Geneva", "sans-serif"],
			},
		},
		fontSize: {
			subtext: "7pt",
			admin: "8.5pt",
			comment: "9pt",
			base: "10pt",
		},
		colors: {
			primary: "#ff6600",
			bg: "#f6f6ef",
			default: "#828282",
			black: "#000000",
			white: "#ffffff",
		},
	},
	plugins: [],
} satisfies Config;
