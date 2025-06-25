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
git branch -a
echo "Current Branch: $(git branch --show-current)"

# 📁 Project Structure
echo -e "\n📁 Project Structure:"
if command -v tree &> /dev/null; then
  tree -L 3 -I 'node_modules|dist|build|coverage' --dirsfirst
else
  echo "tree command not available - showing basic directory structure:"
  find . -maxdepth 2 -type d -not -path '*/node_modules*' -not -path '*/.git*' | head -20
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
