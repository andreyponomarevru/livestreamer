import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import image from "@rollup/plugin-image";
import htmlPurge from "vite-plugin-html-purgecss";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd() + "/docker");

  return {
    plugins: [
      react(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (htmlPurge as any).default(),
      viteStaticCopy({
        targets: [
          { src: "./public/img", dest: "img" },
          { src: "./public/favicons", dest: "" },
        ],
      }),
      image(),
    ],

    define: { "process.env": { ...envVars } },

    base: "/",

    server: {
      cors: false,
      allowedHosts: true,
      port: Number(envVars.VITE_PORT),
      host: "0.0.0.0", // when you run vite inside Docker, do not replace this value with "localhost" or any other value, otherwise you won't be able to access this dev server when it runs inside the Docker container. If webpack runs not inside Docker and you still have issues, try changing the value to "127.0.0.1" or "localhost"
    },
    build: {
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
        },
      },
    },
  };
});
