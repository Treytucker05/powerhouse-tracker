# 5/3/1 Extraction Build

**Source of truth:** scripts/extraction.config.json  
**Build Excel + CSVs:**  
- TypeScript: npm run extract:build  
- Pure JS fallback: npm run extract:build:js

Outputs:
- Excel: data/extraction/531_extraction_template.xlsx
- CSVs: public/methodology/extraction/*.csv

Rule: Never hand-edit Excel/CSV. Edit the JSON, then rebuild.
