#!/usr/bin/env bash
# PowerHouse Tracker – repo audit
set -e
echo "🔍 PowerHouse Tracker Repo Analysis"
echo "=================================="

# 📊 Repository Overview
echo -e "\n📊 Repository Overview:"
echo "- Total Files: $(find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' | wc -l)"
echo "- JavaScript Files: $(find . -name '*.js' -o -name '*.jsx' -not -path '*/node_modules/*' | wc -l)"
echo "- React Components: $(find . -name '*.jsx' -not -path '*/node_modules/*' | wc -l)"
echo "- CSS Files: $(find . -name '*.css' -not -path '*/node_modules/*' | wc -l)"
echo "- Total Lines of Code: $(find . -name '*.js' -o -name '*.jsx' -o -name '*.css' -not -path '*/node_modules/*' | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')"

# 🌿 Branch Status
echo -e "\n🌿 Branch Status:"
git --no-pager branch -a
echo "Current Branch: $(git --no-pager branch --show-current)"

echo -e "\n📁 Project Structure:"
if command -v tree >/dev/null 2>&1; then
  # Windows 'tree.exe' doesn't support -L, so detect MSYS/Cygwin
  if uname -o 2>/dev/null | grep -qiE "msys|cygwin"; then
    # Use Windows tree syntax: /F shows files, /A uses ASCII chars
    tree . /F /A | head -n 50
  else
    tree -L 1 -I 'node_modules|dist|build|coverage' --dirsfirst
  fi
else
  echo "(ℹ️  'tree' command not found on PATH)"
fi

# 📦 Dependencies
echo -e "\n📦 Dependencies:"
if [ -f package.json ]; then
  if command -v jq &> /dev/null; then
    jq -r '.dependencies, .devDependencies' package.json | grep -E '"react"|"zustand"|"vite"' || echo "No key dependencies found"
  else
    echo "jq not available - showing raw package.json dependencies:"
    grep -E '"react"|"zustand"|"vite"' package.json || echo "No key dependencies found"
  fi
else
  echo "No package.json found"
fi

# ⚠️ TODO/FIXME tally
echo -e "\n⚠️ TODO/FIXME Comments:"
grep -R --include='*.{js,jsx,ts,tsx}' -E 'TODO|FIXME|HACK|XXX' . | wc -l

exit 0
