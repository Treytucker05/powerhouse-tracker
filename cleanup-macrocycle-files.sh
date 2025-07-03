#!/bin/bash

# Macrocycle Files Cleanup Script
# This script archives or deletes old/legacy macrocycle files
# Run this after confirming the unified Macrocycle.jsx is working

echo "🧹 Macrocycle Files Cleanup Script"
echo "=================================="

# Define base directories
TRACKER_UI_GOOD="tracker-ui-good/tracker-ui/src/pages"
TRACKER_UI="tracker-ui/src/pages"
TRACKER_UI_CLEAN="tracker-ui-clean/src/pages"

# Define legacy files to clean up
LEGACY_FILES=(
    "$TRACKER_UI_GOOD/Macrocycle7.1.25.fixed.jsx"
    "$TRACKER_UI_GOOD/Macrocycle7.1.25.jsx"
    "$TRACKER_UI/Macrocycle.jsx"
    "$TRACKER_UI/MacrocycleEnhanced.jsx"
    "$TRACKER_UI_CLEAN/Macrocycle.jsx"
    "$TRACKER_UI_CLEAN/MacrocycleBuilder.jsx"
)

# Create archive directory
ARCHIVE_DIR="archive/macrocycle-legacy-$(date +%Y%m%d)"
mkdir -p "$ARCHIVE_DIR"

echo "📁 Created archive directory: $ARCHIVE_DIR"
echo ""

# Function to safely archive a file
archive_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "📦 Archiving: $file"
        cp "$file" "$ARCHIVE_DIR/$(basename "$file")"
        rm "$file"
        echo "✅ Archived and removed: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Archive legacy files
echo "🗂️  Archiving legacy macrocycle files..."
echo "----------------------------------------"

for file in "${LEGACY_FILES[@]}"; do
    archive_file "$file"
done

echo ""
echo "🎯 Cleanup Summary:"
echo "- Legacy files archived to: $ARCHIVE_DIR"
echo "- Active file: tracker-ui-good/tracker-ui/src/pages/Macrocycle.jsx"
echo "- Routing updated in App.jsx to use unified Macrocycle component"
echo ""
echo "✅ Cleanup complete! Only the unified Macrocycle.jsx should remain active."
echo ""
echo "📝 Next steps:"
echo "1. Test the macrocycle builder in the browser"
echo "2. Verify all features work correctly"
echo "3. If everything works, you can safely delete the archive folder"
