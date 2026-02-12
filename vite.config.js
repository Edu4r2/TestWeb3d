import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/TestWeb3d/',
    plugins: [
        react(),
        //        obfuscatorPlugin({
        //            options: {
        //                compact: true,
        //                controlFlowFlattening: false,
        //                deadCodeInjection: false,
        //                identifierNamesGenerator: 'hexadecimal',
        //                renameGlobals: false,
        //                selfDefending: false,
        //                stringArray: true,
        //                stringArrayEncoding: ['base64'],
        //                stringArrayThreshold: 0.75,
        //                splitStrings: true,
        //                splitStringsChunkLength: 10,
        //            },
        //        }),
    ],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
