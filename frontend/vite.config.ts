import path from "path"
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(),],
    resolve: {
        alias: {
            "@/components": path.resolve(__dirname, "src/components"),
            "@/components/ui": path.resolve(__dirname, "src/components/ui"),
            "@/hooks": path.resolve(__dirname, "src/hooks"),
            "@/lib": path.resolve(__dirname, "src/lib"),
            "@/utils": path.resolve(__dirname, "src/lib/utils")
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:4545",
                changeOrigin: true,
            },
        },
    },
})
