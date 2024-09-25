import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "Holo UI",
      fileName: "holo-ui",
      formats: ["es"],
    },
    copyPublicDir: false,
    sourcemap: true,
    minify: "esbuild",
    cssCodeSplit: true,
    cssMinify: true,
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "lib",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        assetFileNames: "[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: {
      "@holo-ui": resolve(__dirname, "lib"),
    },
  },
});
