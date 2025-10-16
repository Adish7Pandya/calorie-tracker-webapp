import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Make lovable-tagger optional: if it's not installed, fall back to a no-op plugin.
// This prevents the dev server from failing when the package is missing.
// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let componentTagger: any = undefined;
  try {
    // dynamic import so missing package won't crash startup
    const mod = await import("lovable-tagger");
    componentTagger = mod.componentTagger;
  } catch (err) {
    // module not found — use a noop
    componentTagger = () => ({ name: "noop-component-tagger" });
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
