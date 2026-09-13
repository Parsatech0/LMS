<# 
.SYNOPSIS
    LMS Project - خودکار کردن کامل نصب و راه‌اندازی
.DESCRIPTION
    این اسکریپت همه مراحل رو انجام میده:
    1. پیش‌نیازها رو چک می‌کنه (Node، Docker)
    2. فایل .env رو می‌سازه
    3. پکیج‌ها رو نصب می‌کنه
    4. دیتابیس رو می‌سازه و می‌گره
    5. کاربرهای پیش‌فرض رو اضافه می‌کنه
    6. سرور رو اجرا می‌کنه
#>

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     LMS Project - نصب خودکار (One-Click Setup)             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ──────────────────────────────────────────────
# تابع‌های کمکی
# ──────────────────────────────────────────────
function Write-Step($msg) { Write-Host "`n▶ $msg" -ForegroundColor Yellow }
function Write-Success($msg) { Write-Host "  ✅ $msg" -ForegroundColor Green }
function Write-Error($msg) { Write-Host "  ❌ $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  ℹ $msg" -ForegroundColor Gray }
function Write-Warning($msg) { Write-Host "  ⚠ $msg" -ForegroundColor Magenta }

function Check-Command($cmd, $name, $installHint) {
    try {
        & $cmd --version 2>$null | Out-Null
        Write-Success "$name نصب شده"
        return $true
    } catch {
        Write-Error "$name پیدا نشد!"
        Write-Info "نحوه نصب: $installHint"
        return $false
    }
}

# ──────────────────────────────────────────────
# ۱. پیش‌نیازها
# ──────────────────────────────────────────────
Write-Step "مرحله ۱: چک کردن پیش‌نیازها..."

$nodeOk = Check-Command "node" "Node.js" "از nodejs.org دانلود کن"
$npmOk = Check-Command "npm" "npm" "با Node.js میاد"
$dockerOk = Check-Command "docker" "Docker" "از docker.com دانلود کن (اختیاری)"

if (-not $nodeOk -or -not $npmOk) {
    Write-Error "Node.js و npm الزامی هستند. اول اونا رو نصب کن بعد دوباره اجرا کن."
    Read-Host "Enter برای خروج"
    exit 1
}

# ──────────────────────────────────────────────
# ۲. فایل .env
# ──────────────────────────────────────────────
Write-Step "مرحله ۲: ساختن فایل .env..."

$projectPath = "C:\Users\LENOVO\Desktop\CODE\lms-project"
$envFile = "$projectPath\.env"
$envExample = "$projectPath\.env.example"

if (Test-Path $envFile) {
    Write-Warning "فایل .env از قبل وجود داره. می‌خوای بازنویسی شه؟ (y/n)"
    $ans = Read-Host
    if ($ans -ne 'y' -and $ans -ne 'Y') {
        Write-Info "فایل .env بدون تغییر موند."
    } else {
        Copy-Item $envExample $envFile -Force
        Write-Success "فایل .env دوباره ساخته شد."
    }
} else {
    Copy-Item $envExample $envFile -Force
    Write-Success "فایل .env از مثال کپی شد."
}

Write-Info "الان باید DATABASE_URL رو تو فایل .env تنظیم کنی."
Write-Info "فایل باز میشه... (ذخیره کن و ببند)"
Start-Process notepad.exe $envFile
Write-Host "`nوقتی فایل رو ذخیره کردی و بستی، اینجا Enter بزن..."
Read-Host | Out-Null

# ──────────────────────────────────────────────
# ۳. دیتابیس (Docker اختیاری)
# ──────────────────────────────────────────────
Write-Step "مرحله ۳: دیتابیس..."

$hasLocalDb = $false
if ($dockerOk) {
    Write-Host "می‌خوای Docker دیتابیس برات بالا بیاره؟ (y/n) [پیش‌فرض: y]"
    $useDocker = Read-Host
    if ($useDocker -eq '' -or $useDocker -eq 'y' -or $useDocker -eq 'Y') {
        Write-Info "داکر کامپوز رو اجرا می‌کنم..."
        Set-Location $projectPath
        docker-compose up -d postgres
        Start-Sleep -Seconds 5
        $hasLocalDb = $true
        Write-Success "پست‌گریس روی پورت 5432 بالا اومد."
    }
}

if (-not $hasLocalDb) {
    Write-Warning "مطمئن شو فایل .env رو با آدرس دیتابیس واقعی پر کردی!"
    Write-Info "مثال: postgresql://user:pass@localhost:5432/lms_db"
    Write-Host "آماده هستی؟ Enter بزن..."
    Read-Host | Out-Null
}

# ──────────────────────────────────────────────
# ۴. نصب پکیج‌ها
# ──────────────────────────────────────────────
Write-Step "مرحله ۴: نصب پکیج‌ها (چند دقیقه صبر کن)..."
Set-Location $projectPath
try {
    npm install 2>&1 | Out-Null
    Write-Success "پکیج‌ها نصب شدن."
} catch {
    Write-Error "نصب پکیج‌ها با خطا مواجه شد."
    Write-Info "خروجی خطا رو بررسی کن:"
    npm install
    Read-Host "Enter برای خروج"
    exit 1
}

# ──────────────────────────────────────────────
# ۵. Migration دیتابیس
# ──────────────────────────────────────────────
Write-Step "مرحله ۵: اجرای میگریشن دیتابیس..."
try {
    npm run db:migrate 2>&1 | Out-Null
    Write-Success "میگریشن‌ها اجرا شدن."
} catch {
    Write-Error "مگیره کردن دیتابیس شکست خورد."
    Write-Info "معمولاً یعنی دیتابیس قابل دسترس نیست یا DATABASE_URL اشتباهه."
    Write-Info "فایل .env رو چک کن و دوباره امتحان کن."
    Read-Host "Enter برای خروج"
    exit 1
}

# ──────────────────────────────────────────────
# ۶. Seed (کاربرهای پیش‌فرض)
# ──────────────────────────────────────────────
Write-Step "مرحله ۶: اضافه کردن کاربرهای پیش‌فرض..."
try {
    npm run db:seed 2>&1 | Out-Null
    Write-Success "کاربرهای پیش‌فرض اضافه شدن."
} catch {
    Write-Warning "سیِد کردن با خطا مواجه شد (ممکنه کاربرها از قبل وجود داشته باشن)."
}

# ──────────────────────────────────────────────
# ۷. اجرا
# ──────────────────────────────────────────────
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  🎉 همه چیز تمومه! سرور رو الان اجرا کنم؟ (y/n)            ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
$run = Read-Host
if ($run -eq 'y' -or $run -eq 'Y' -or $run -eq '') {
    Write-Host "`n🚀 سرور در حال اجراست... مرورگر رو باز کن: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "برای توقف: Ctrl+C بزن`n" -ForegroundColor Gray
    npm run dev
} else {
    Write-Host "`nبرای اجرای دستی بعدا:`n  cd $projectPath`n  npm run dev`n" -ForegroundColor Yellow
}

# ──────────────────────────────────────────────
# خلاصه حسابد
# ──────────────────────────────────────────────
Write-Host "`n📋 حساب‌های پیش‌فرض ساخته شده:" -ForegroundColor Cyan
Write-Host "  👑 Owner:     owner@lms.local     / owner123" -ForegroundColor Gray
Write-Host "  🛡 Admin:     admin@lms.local     / admin123" -ForegroundColor Gray
Write-Host "  👨‍🏫 Instructor: instructor@lms.local / instructor123" -ForegroundColor Gray
Write-Host "  🎓 Student:   student1@lms.local   / student123" -ForegroundColor Gray
Write-Host "  🎓 Student:   student2@lms.local   / student123" -ForegroundColor Gray

Write-Host "`n⚠️  نکته مهم: رمزها رو در محیط واقعی (Production) حتما تغییر بده!" -ForegroundColor Red
Write-Host "`nتموم! 🎈" -ForegroundColor Green