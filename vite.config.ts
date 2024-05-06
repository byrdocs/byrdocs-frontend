import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { execSync } from "child_process";

const commitDate = execSync('git log -1 --format=%cI').toString().trimEnd();
const commitHash = execSync('git rev-parse HEAD').toString().trimEnd();
const lastCommitMessage = execSync('git show -s --format="%s"').toString().trimEnd();

process.env.VITE_GIT_COMMIT_DATE = commitDate;
process.env.VITE_GIT_COMMIT_HASH = commitHash;
process.env.VITE_GIT_LAST_COMMIT_MESSAGE = lastCommitMessage;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
        "/files": {
            target: "http://localhost:3000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/files/, ""),
        },
    }
  }
})
