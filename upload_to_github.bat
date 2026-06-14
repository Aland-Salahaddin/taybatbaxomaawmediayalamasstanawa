@echo off
echo ==============================================
echo       KurdMedia GitHub Upload Helper
echo ==============================================
echo.

:: Check if git is initialized
if not exist .git (
    echo [INFO] Initializing Git repository...
    git init
) else (
    echo [INFO] Git repository already initialized.
)

:: Check user.name configuration
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [PROMPT] Git user name is not set.
    set /p GIT_NAME="Enter your Git/GitHub name (e.g. John Doe): "
    git config --global user.name "%GIT_NAME%"
)

:: Check user.email configuration
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [PROMPT] Git user email is not set.
    set /p GIT_EMAIL="Enter your Git/GitHub email address: "
    git config --global user.email "%GIT_EMAIL%"
)

echo.
echo [INFO] Staging all files...
git add .

echo [INFO] Creating initial commit...
git commit -m "Initial commit - Kurdish TV Streaming Web Application (Sorani & Sports)"

echo.
echo [IMPORTANT] Please create a new empty repository on GitHub first if you haven't already.
echo Example URL: https://github.com/yourusername/kurdish-tv-app.git
echo.
set /p REPO_URL="Enter your GitHub Repository URL: "

:: Remove old origin remote if it exists and add the new one
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [INFO] Pushing files to GitHub (main branch)...
echo (A Windows pop-up window may appear to log in or authorize GitHub Access)
echo.
git push -u origin main

echo.
echo ==============================================
echo Done! If git pushed successfully, your files are online.
echo ==============================================
pause
