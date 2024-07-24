import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//     server: {
//       proxy: {
//         "/api": {
//           target: "http://127.0.0.1:4000",
//           changeOrigin: true,
//           secure: false,
//           ws: true,
//           rewrite: (path) => path.replace(/^\/api/, ""),
//         },
//       },
//       port: 5173,
//     },
//     plugins: [react()],
//   });

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
  