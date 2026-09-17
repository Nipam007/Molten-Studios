@echo off
REM Deploys ONLY the public/ folder. Never deploy "." from this project --
REM that would upload .claude/, preview.bat and other private files to the
REM live site. Cloudflare Pages ignores .gitignore, so the folder boundary
REM is the only thing keeping them off the web.
echo Deploying Molten Studios...
npx wrangler pages deploy public --project-name=molten-studios --commit-dirty=true
pause
