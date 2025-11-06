import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'assets': path.resolve(__dirname, 'src/assets'),
            'components': path.resolve(__dirname, 'src/components'),
            'hooks': path.resolve(__dirname, 'src/hooks'),
            'layouts': path.resolve(__dirname, 'src/layouts'),
            'pages': path.resolve(__dirname, 'src/pages'),
            'services': path.resolve(__dirname, 'src/services'),
            'utils': path.resolve(__dirname, 'src/utils')
        }
    },
    define: {
        global: 'window',
    },

})
