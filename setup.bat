@echo off
chcp 65001 >nul
title LMS Project - Auto Setup

echo ╔══════════════════════════════════════════════════════════════╗
echo ║     LMS Project - Auto Setup (Windows Batch)               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Install from https://nodejs.org
    pause & exit /b 1
)
echo ✅ Node.js found

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    pause & exit /b 1
)
echo ✅ npm found

echo.
echo [2/7] Creating .env file...
if exist .env (
    echo ⚠ .env already exists. Overwrite? (y/n)
    set /p OVERWRITE=
    if /i "%OVERWRITE%"=="y" copy .env.example .env /y >nul
) else (
    copy .env.example .env /y >nul
)
echo ✅ .env ready

echo.
echo ═══════════════════════════════════════════════════════════
echo  IMPORTANT: Edit .env file now - set DATABASE_URL
echo ═══════════════════════════════════════════════════════════
notepad .env
echo.
echo Press Enter after saving .env...
pause >nul

echo.
echo [3/7] Database setup...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker found. Start PostgreSQL container? (y/n)
    set /p USE_DOCKER=
    if /i "%USE_DOCKER%"=="y" (
        echo Starting PostgreSQL...
        docker-compose up -d postgres
        timeout /t 5 >nul
        echo ✅ PostgreSQL started on port 5432
    )
) else (
    echo Docker not found. Make sure DATABASE_URL in .env points to your PostgreSQL.
)

echo.
echo [4/7] Installing packages (this takes a minute)...
npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause & exit /b 1
)
echo ✅ Packages installed

echo.
echo [5/7] Running database migrations...
npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ Migration failed - check DATABASE_URL in .env
    pause & exit /b 1
)
echo ✅ Migrations done

echo.
echo [6/7] Seeding default users...
npm run db:seed
echo ✅ Default users created

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  🎉 ALL DONE! Start server now? (y/n)                       ║
echo ╚══════════════════════════════════════════════════════════════╝
set /p START_NOW=
if /i "%START_NOW%"=="y" (
    echo.
    echo 🚀 Starting server... Open http://localhost:3000
    echo Press Ctrl+C to stop
    echo.
    npm run dev
) else (
    echo.
    echo To start later run: npm run dev
    echo.
)

echo.
echo 📋 Default accounts created:
echo    Owner:      owner@lms.local     / owner123
echo    Admin:      admin@lms.local     / admin123
echo    Instructor: instructor@lms.local / instructor123
echo    Student:    student1@lms.local   / student123
echo    Student:    student2@lms.local   / student123
echo.
echo ⚠️  CHANGE PASSWORDS IN PRODUCTION!
echo.
pause