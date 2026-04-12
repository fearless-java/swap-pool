import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// Brand Colors - High Saturation, Minimal Borders
				brand: {
					primary: "#FF2D55",
					secondary: "#00D4FF",
					accent: "#00FF88",
					yellow: "#FFE500",
					orange: "#FF6B35",
					purple: "#9B5DE5",
				},
			},
		},
	},
} satisfies Config;
