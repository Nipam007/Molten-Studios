@echo off
echo Starting local preview...
echo.
echo Once it says "Ready on http://127.0.0.1:8789", open that address in your browser.
echo Press Ctrl+C in this window to stop the preview when you're done.
echo.
npx wrangler pages dev public --port 8789
pause
