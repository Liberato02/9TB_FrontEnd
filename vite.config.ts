
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const plugins = [react(), tailwindcss()];

  // O build de produção não precisa das credenciais locais.
  if (command !== "serve") {
    return {
      plugins,
    };
  }

  // Credenciais utilizadas apenas pelo servidor local.
  const env = loadEnv(mode, process.cwd(), "ARIA_DEV_");

  const usuario = env.ARIA_DEV_USER;
  const senha = env.ARIA_DEV_PASSWORD;

  if (!usuario || !senha) {
    throw new Error(
      "Configure ARIA_DEV_USER e ARIA_DEV_PASSWORD no .env.local"
    );
  }

  const credenciais = Buffer.from(
    `${usuario}:${senha}`,
    "utf8"
  ).toString("base64");

  return {
    plugins,

    server: {
      host: "127.0.0.1",

      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,

          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader(
                "Authorization",
                `Basic ${credenciais}`
              );
            });
          },
        },
      },
    },
  };
});
