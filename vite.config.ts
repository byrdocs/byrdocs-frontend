import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { execSync } from "child_process";

const commitDate = execSync("git log -1 --format=%cI").toString().trimEnd();
const commitHash = execSync("git rev-parse HEAD").toString().trimEnd();
const lastCommitMessage = execSync('git show -s --format="%s"')
  .toString()
  .trimEnd();

process.env.VITE_GIT_COMMIT_DATE = commitDate;
process.env.VITE_GIT_COMMIT_HASH = commitHash;
process.env.VITE_GIT_LAST_COMMIT_MESSAGE = lastCommitMessage;

const BASE_URL = process.env.BASE_URL ?? "https://byrdocs.org";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
          ],
          search: ["minisearch", "jieba-wasm"],
          icons: ["lucide-react", "@radix-ui/react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      "/files": BASE_URL,
      "/thumbnail": BASE_URL,
      "/api": BASE_URL,
    },
  },
});
