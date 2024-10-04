import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json", include: ["packages"] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "packages/index.ts"),
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
      "@holo-ui": resolve(__dirname, "packages"),
    },
  },
});
