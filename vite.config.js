import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'process': 'process/browser', // Giải quyết lỗi `process.env`
    },
  },
  define: {
    'process.env': {},  // Giải quyết lỗi CKEditor với Vite
  },
})
