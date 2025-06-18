# PowerHouse Tracker Scripts

## Overview

This directory contains utility scripts for auditing and converting the PowerHouse Tracker UI inventory.

## Scripts

### 1. save-clipboard-json.js
Saves clipboard contents to `buttons.json` at the project root.

**Usage:**
```bash
node scripts/save-clipboard-json.js
```

**Purpose:** After running the Step 1A browser console script (which copies inventory JSON to clipboard), this script saves it to a file for processing.

**Features:**
- Reads system clipboard content
- Validates JSON format (warns if invalid but saves anyway)
- Overwrites existing `buttons.json`
- Shows file size and content preview
- Error handling for empty clipboard

### 2. report-missing-handlers.js
Identifies buttons with missing event handlers from the inventory.

**Usage:**
```bash
node scripts/report-missing-handlers.js
```

**Purpose:** Scans `buttons.json` and reports buttons where `hasHandler` is false OR `handlerName` is "(none)".

**Features:**
- Filters buttons missing handlers
- Shows expected handler function names
- Provides section-by-section breakdown
- Calculates handler coverage percentage
- Suggests next steps for implementation

### 3. convert-inventory-to-md.js
Converts the JSON inventory from Step 1A into comprehensive markdown audit tables.

**Usage:**
```bash
node scripts/convert-inventory-to-md.js
```

**Prerequisites:** Requires `buttons.json` file (created by save-clipboard-json.js or manual save)

## Complete Workflow

### Step 1: Generate Inventory
Run the Step 1A console script in your browser:

```javascript
// Run this in browser console on index.html
// This will output the inventory JSON to clipboard
copy(inventoryData);
```

### Step 2: Save Clipboard to File
```bash
node scripts/save-clipboard-json.js
```

### Step 3: Convert to Audit Tables
```bash
node scripts/convert-inventory-to-md.js
```

### Step 4: Review Generated Files
The conversion creates two comprehensive audit tables:

## Generated Files

### BUTTON_MASTER_TABLE.md
Complete button inventory with these exact columns:
- **Section**: Workflow phase or form section
- **Button ID**: Unique button identifier  
- **Label**: Display text on button
- **Form**: Parent form/calculator name
- **Inputs**: Related input fields (comma-separated)
- **Category**: Auto-categorized type (RP Algorithms, Live Monitoring, etc.)
- **RP Book Reference**: *(blank - to be filled manually)*
- **Formula Accuracy**: *(blank - to be filled manually)*  
- **Handler**: JavaScript function/method
- **Works?**: ✅/❌/⚠️ status indicator
- **Priority**: *(blank - to be filled manually)*
- **Notes**: *(blank - to be filled manually)*

### CALCULATOR_AUDIT.md
Calculator analysis with these exact columns:
- **Calculator**: Form/calculator name
- **Purpose**: Auto-detected or manual purpose
- **RP Book Formula**: *(blank - to be filled manually)*
- **Current Implementation**: Summary of algorithms/actions
- **Accuracy**: *(blank - to be filled manually)*
- **Test Cases**: *(blank - to be filled manually)*
- **Notes**: *(blank - to be filled manually)*

Plus detailed breakdown of each calculator's components.

## Input File Structure

The script expects `buttons.json` with this structure:

```json
{
  "buttons": [
    {
      "id": "btnExample",
      "label": "Example Button", 
      "section": "Phase 1 · Foundation Setup",
      "calculator": "Volume Landmarks",
      "form": "volumeCard",
      "handler": "exampleFunction()"
    }
  ],
  "inputs": [
    {
      "id": "exampleInput",
      "name": "Example Input",
      "type": "number",
      "form": "volumeCard",
      "calculator": "Volume Landmarks"
    }
  ],
  "algorithms": [
    {
      "name": "exampleAlgorithm",
      "function": "exampleFunction()",
      "category": "RP Algorithms", 
      "calculator": "Volume Landmarks",
      "purpose": "Example calculation"
    }
  ]
}
```

## Features

### Auto-Categorization
Buttons are automatically categorized based on naming patterns:
- **RP Algorithms**: RP, Algorithm keywords
- **Live Monitoring**: Live, Session keywords
- **Auto-Progression**: Auto, Progression keywords  
- **AI/Intelligence**: Intelligence, AI keywords
- **Analysis**: Deload, Analysis keywords
- **Configuration**: Setup, Config keywords
- **Volume Management**: Volume, Frequency keywords
- **Foundation/Mesocycle/Weekly/Daily**: Based on section names

### Handler Status Detection
- ✅ **Working**: Contains "✅" or "working" in handler info
- ⚠️ **Stub**: Contains "stub" or "placeholder" 
- ❌ **Missing**: No handler or broken implementation

### Smart Grouping
- Buttons sorted by Section, then Button ID
- Calculators grouped by shared forms/sections
- Related inputs automatically linked to calculators

## Next Steps

After generation:
1. Fill in RP Book Reference columns with specific formula citations
2. Add Formula Accuracy ratings (High/Medium/Low)
3. Set Priority levels (Critical/High/Medium/Low)
4. Add Test Cases for calculator validation
5. Include implementation Notes and observations

This creates a comprehensive audit trail for RP methodology compliance and UI functionality.
