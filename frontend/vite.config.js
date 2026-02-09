import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Build directly into Django's static files
        outDir: '../static/dist',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: {
                main: './src/main.jsx',
            },
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    },
    server: {
        origin: 'http://localhost:5173',
    }
})
