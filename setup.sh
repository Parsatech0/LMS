#!/bin/bash
# LMS Project - Auto Setup (Linux/macOS/Git Bash/WSL)
# Run: chmod +x setup.sh && ./setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     LMS Project - Auto Setup (Linux/macOS/WSL)               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper functions
step() { echo -e "\n${YELLOW}▶ $1${NC}"; }
success() { echo -e "  ${GREEN}✅ $1${NC}"; }
error() { echo -e "  ${RED}❌ $1${NC}"; }
info() { echo -e "  ${GRAY}ℹ $1${NC}"; }
warn() { echo -e "  ${YELLOW}⚠ $1${NC}"; }

check_cmd() {
    if command -v "$1" >/dev/null 2>&1; then
        success "$2 found"
        return 0
    else
        error "$2 not found!"
        info "Install: $3"
        return 1
    fi
}

# 1. Prerequisites
step "Step 1: Checking prerequisites..."
check_cmd node "Node.js" "https://nodejs.org" || { error "Node.js required"; exit 1; }
check_cmd npm "npm" "comes with Node.js" || { error "npm required"; exit 1; }
check_cmd docker "Docker" "https://docker.com (optional)" && HAS_DOCKER=1 || HAS_DOCKER=0

# 2. .env file
step "Step 2: Creating .env file..."
if [ -f .env ]; then
    warn ".env exists. Overwrite? (y/n)"
    read -r ans
    if [[ "$ans" =~ ^[Yy]$ ]]; then
        cp .env.example .env
        success ".env recreated"
    else
        info "Keeping existing .env"
    fi
else
    cp .env.example .env
    success ".env created from example"
fi

info "Now edit .env - set DATABASE_URL"
info "Opening in default editor..."
${EDITOR:-nano} .env
echo ""
read -p "Press Enter after saving .env..."

# 3. Database
step "Step 3: Database setup..."
if [ "$HAS_DOCKER" = "1" ]; then
    echo "Start PostgreSQL via Docker? (y/n) [default: y]"
    read -r use_docker
    if [[ -z "$use_docker" || "$use_docker" =~ ^[Yy]$ ]]; then
        info "Starting PostgreSQL..."
        docker-compose up -d postgres
        sleep 5
        success "PostgreSQL running on port 5432"
    fi
else
    warn "Docker not found. Ensure DATABASE_URL in .env points to your PostgreSQL."
fi

# 4. Install packages
step "Step 4: Installing packages (takes a minute)..."
npm install
success "Packages installed"

# 5. Migrations
step "Step 5: Running database migrations..."
npm run db:migrate
success "Migrations completed"

# 6. Seed
step "Step 6: Seeding default users..."
npm run db:seed
success "Default users created"

# 7. Start
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 ALL DONE! Start server now? (y/n) [default: y]           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
read -r start_now
if [[ -z "$start_now" || "$start_now" =~ ^[Yy]$ ]]; then
    echo -e "\n${CYAN}🚀 Starting server... Open http://localhost:3000${NC}"
    echo -e "${GRAY}Press Ctrl+C to stop${NC}\n"
    npm run dev
else
    echo -e "\n${YELLOW}To start later:${NC}"
    echo "  cd $PROJECT_DIR"
    echo "  npm run dev"
fi

echo ""
echo -e "${CYAN}📋 Default accounts created:${NC}"
echo -e "  ${GRAY}👑 Owner:     owner@lms.local     / owner123${NC}"
echo -e "  ${GRAY}🛡 Admin:     admin@lms.local     / admin123${NC}"
echo -e "  ${GRAY}👨‍🏫 Instructor: instructor@lms.local / instructor123${NC}"
echo -e "  ${GRAY}🎓 Student:   student1@lms.local   / student123${NC}"
echo -e "  ${GRAY}🎓 Student:   student2@lms.local   / student123${NC}"
echo ""
echo -e "${RED}⚠️  CHANGE PASSWORDS IN PRODUCTION!${NC}"
echo -e "${GREEN}Done! 🎈${NC}"