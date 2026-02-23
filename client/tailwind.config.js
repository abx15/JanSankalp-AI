/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Civic Theme Colors
                civic: {
                    primary: "#065F46", // Dark Green
                    secondary: "#1E3A8A", // Deep Blue
                    accent: "#F97316", // Orange
                    background: "#F1F5F9", // Light Neutral Background
                    text: "#0F172A", // Dark Text
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#065F46",
                    foreground: "#FFFFFF",
                    hover: "#047857",
                },
                secondary: {
                    DEFAULT: "#1E3A8A",
                    foreground: "#FFFFFF",
                    hover: "#1E40AF",
                },
                accent: {
                    DEFAULT: "#F97316",
                    foreground: "#FFFFFF",
                    hover: "#EA580C",
                },
                destructive: {
                    DEFAULT: "#DC2626",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#F1F5F9",
                    foreground: "#64748B",
                },
                accent: {
                    DEFAULT: "#F97316",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
                success: "#16A34A",
            },
            borderRadius: {
                lg: "12px",
                md: "10px",
                sm: "8px",
                xl: "16px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
