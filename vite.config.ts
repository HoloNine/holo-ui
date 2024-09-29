import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "packages/index.ts"),
      name: "Holo UI",
      fileName: "holo-ui",
      formats: ["es"],
    },
    copyPublicDir: false,
    sourcemap: true,
    minify: "esbuild",
    emptyOutDir: true,
    outDir: "build",
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "packages",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
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
