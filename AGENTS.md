<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Website publication workflow

This project belongs to the user and publishes through GitHub to Vercel.
Repository: https://github.com/qzperf/qz-performance-strona
Production branch: main.

The user authorized routine website changes requested in this chat to be implemented, checked, committed, and pushed to origin/main. Do not ask for a separate routine publishing confirmation. Verify the deployment outcome when access is available; clearly distinguish a successful Git push from a verified Vercel deployment.

Preserve remote history and unrelated changes. Never force-push. Keep .env.local, DOSTEP-DO-PANELU.txt, data/, and credentials out of Git. Store deployment secrets only in the appropriate service's environment settings. Use the project's existing checks appropriate to each change.
