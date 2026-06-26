import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const root = __dirname;

export default defineConfig({
  base: "/Trekki-store/",
  plugins: [vue()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets/build",
    minify: "esbuild",
    cssMinify: "esbuild",
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        longsleeves: resolve(root, "longsleeves.html"),
        tshirts: resolve(root, "tshirts.html"),
        buffs: resolve(root, "buffs.html"),
        fabrics: resolve(root, "fabrics.html"),
        printing: resolve(root, "printing.html"),
        sizes: resolve(root, "sizes.html"),
        futureItems: resolve(root, "future-items.html")
      }
    }
  }
});
