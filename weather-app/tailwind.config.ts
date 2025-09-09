import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/**/*.{js, ts, tsx, jsx}",],
    theme: {
        extend:{
            colors: {
                brand: {

                },
            },
            fontFamily: {
                sans: ["var(--font-dm-snas)", "sans-serif"],
                display: ["var(--font-brocolage)", "sans-serif"]
            },
            spacing: {
                
            }
        }
    }
}