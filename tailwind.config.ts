import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(210 20% 88%)",
        ink: "hsl(214 32% 14%)",
        muted: "hsl(215 16% 46%)",
        surface: "hsl(0 0% 100%)",
        canvas: "hsl(48 24% 96%)",
        leaf: {
          50: "hsl(135 38% 96%)",
          100: "hsl(133 34% 90%)",
          600: "hsl(145 45% 31%)",
          700: "hsl(147 48% 24%)"
        }
      },
      boxShadow: {
        panel: "0 1px 2px rgb(15 23 42 / 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
