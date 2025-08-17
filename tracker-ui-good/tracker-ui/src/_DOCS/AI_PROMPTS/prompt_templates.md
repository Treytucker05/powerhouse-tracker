# 🔧 AI PROMPT TEMPLATES FOR POWERHOUSE TRACKER
*Created: August 1, 2025*
*Purpose: Reusable prompt templates for multi-AI research workflow*

## 📚 **EXTRACTION PROMPTS (For ChatGPT)**

### **PROMPT 1: Initial Chapter Analysis**
```
I'm analyzing [BOOK TITLE] for the PowerHouse Tracker fitness program design system. 

Please analyze Chapter [X]: [CHAPTER TITLE] and provide:

1. **Chapter Overview** (2-3 sentences summarizing main focus)
2. **Major Topics Covered** (bulleted list of all significant topics)
3. **Formulas & Calculations** (identify any mathematical content, tables, equations)
4. **Program Examples** (note any workout templates, program structures, or practical applications)
5. **Unique Concepts** (flag any concepts not commonly found in other fitness sources)

Format as bullet points for easy extraction and processing.

TARGET SYSTEM: PowerHouse Tracker integrates RP, 5/3/1, Linear Periodization, Josh Bryant Method, and NASM OPT with algorithmic injury screening and automated program generation.
```

### **PROMPT 2: Targeted Category Extraction**
```
From Chapter [X] of [BOOK TITLE], extract ALL information about [CATEGORY]:

**CURRENT CATEGORY:** [SELECT FROM 15-CATEGORY LIST]

Find and list:
- **Specific Protocols:** Step-by-step procedures mentioned
- **Required Equipment:** Any tools, devices, or materials needed
- **Scoring/Interpretation:** How to evaluate or interpret results
- **Population Modifications:** Variations for different groups (age, gender, experience)
- **Implementation Guidelines:** When and how to use
- **Page Numbers:** Reference all page numbers for each item

**FORMAT:** Structured list with clear headings and actionable details.

If this category isn't covered in this chapter, state "Not present in this chapter."

**INTEGRATION TARGET:** This will be integrated into PowerHouse Tracker's algorithmic assessment and program generation system.
```

### **PROMPT 3: Formula Deep Dive**
```
For ALL formulas, calculations, and mathematical content in Chapter [X] of [BOOK TITLE]:

**EXTRACT:**
1. **Complete Formula** (write out exactly as shown, preserve notation)
2. **Variable Definitions** (define every variable, unit, and term)
3. **Example Calculations** (any worked examples provided in text)
4. **Usage Context** (when to use this formula, what problem it solves)
5. **Variations/Modifications** (alternative versions or adaptations mentioned)
6. **Page References** (exact page numbers for each formula)

**FORMAT:** Mathematical notation preserved, ready for direct implementation in JavaScript algorithms.

**TARGET:** These formulas will be integrated into PowerHouse Tracker's algorithm engine for automated calculations in program generation and progress tracking.
```

### **PROMPT 4: Cross-Reference Quality Check**
```
Review your extraction from Chapter [X] of [BOOK TITLE]. 

**QUALITY CHECK - Did you miss:**
- **Exercise Lists** (specific exercises mentioned or categorized)
- **Tables/Charts** (describe contents and data structure)
- **Sidebar Content** (boxes, tips, highlighted information)
- **Case Studies** (examples, client scenarios, practical applications)
- **Method References** (mentions of other systems, authors, or approaches)
- **Assessment Tools** (questionnaires, screens, evaluation methods)
- **Standards/Norms** (benchmark values, performance standards, reference data)

**ADD ANY MISSED ITEMS** with exact page numbers and brief descriptions.

**INTEGRATION FOCUS:** PowerHouse Tracker needs comprehensive data for its multi-system approach and algorithmic processing.
```

### **PROMPT 5: Chapter Synthesis**
```
Create a structured summary of Chapter [X] from [BOOK TITLE] for PowerHouse Tracker integration:

**SYNTHESIS FORMAT:**

1. **KEY TAKEAWAYS** (3-5 main points that would enhance PowerHouse Tracker)
2. **UNIQUE CONTRIBUTIONS** (concepts not found in RP, 5/3/1, Linear, Josh Bryant, or NASM)
3. **PRACTICAL APPLICATIONS** (how this could be implemented in automated program generation)
4. **INTEGRATION NOTES** (how this fits with existing PowerHouse systems and injury screening)
5. **CRITICAL DATA POINTS** (specific numbers, ratios, standards, or formulas essential for implementation)
6. **IMPLEMENTATION PRIORITY** (High/Medium/Low based on PowerHouse system needs)

**TARGET:** Ready for processing by Claude for implementation planning and GitHub issue creation.
```

---

## 🔍 **ANALYSIS PROMPTS (For Claude)**

### **Research Synthesis Prompt**
```
I have extracted research from [BOOK TITLE] using the multi-stage extraction process. Please analyze this research for PowerHouse Tracker integration:

**CURRENT POWERHOUSE SYSTEMS:**
- Enhanced injury screening with multi-injury algorithms
- RP, 5/3/1, Linear Periodization, Josh Bryant Method implementations
- 8-step streamlined program design workflow
- Timeline system with mesocycles/macrocycles
- Algorithm-driven exercise modifications

**RESEARCH TO ANALYZE:** [Paste extracted content]

**PROVIDE:**
1. **Integration Assessment** - How does this research enhance existing systems?
2. **Implementation Planning** - Break into Small/Medium/Large development tasks
3. **Priority Ranking** - High/Medium/Low based on system impact
4. **Dependency Analysis** - What needs to be built first?
5. **GitHub Issue Recommendations** - Suggest specific implementable features

**OUTPUT:** Ready-to-implement recommendations with clear development roadmap.
```

### **Implementation Planning Prompt**
```
Based on this research extraction, create a detailed implementation plan for PowerHouse Tracker:

**RESEARCH:** [Paste processed research]

**PLAN STRUCTURE:**
1. **Component Analysis** - Which React components need updates?
2. **Algorithm Integration** - How to integrate with existing injury screening and system recommendation?
3. **UI/UX Considerations** - What new interface elements are needed?
4. **Testing Strategy** - How to validate implementation against research?
5. **Implementation Steps** - Ordered sequence with time estimates
6. **Copilot Context** - What files should be open for best AI assistance?

**TARGET:** Actionable plan ready for VS Code + Copilot implementation.
```

---

## ✅ **VALIDATION PROMPTS (For Grok)**

### **Fact-Checking Prompt**
```
Please review these training concepts extracted from [BOOK TITLE] for accuracy and potential contradictions:

**EXTRACTED RESEARCH:** [Paste content]

**VALIDATION FOCUS:**
- Scientific accuracy of claims and methodologies
- Consistency with established training principles
- Potential contradictions with other evidence-based approaches
- Red flags or outdated information
- Missing context or important caveats

**PROVIDE:**
- Accuracy rating (High/Medium/Low confidence)
- Any factual errors or questionable claims
- Contradictions with other established methods
- Recommendations for additional verification
- Overall research quality assessment

**PURPOSE:** Ensuring PowerHouse Tracker integrates only reliable, evidence-based information.
```

### **Cross-Reference Validation**
```
Compare this research extraction with other established training methodologies:

**RESEARCH:** [Paste content]

**COMPARE AGAINST:**
- Renaissance Periodization (Mike Israetel)
- 5/3/1 methodology (Jim Wendler) 
- NASM OPT Model
- Linear Periodization principles
- Current exercise science consensus

**IDENTIFY:**
- Areas of agreement/convergence
- Significant differences or contradictions
- Unique contributions not found elsewhere
- Potential integration challenges
- Research quality indicators

**OUTPUT:** Validation report for integration confidence.
```

---

## 🎨 **VISUAL PROCESSING PROMPTS (For Gemini)**

### **Table/Chart Extraction**
```
Please convert this table/chart from [BOOK TITLE, Page X] into structured markdown format:

**REQUIREMENTS:**
- Preserve all headers and data exactly
- Include units of measurement
- Note any footnotes or explanations
- Describe context of when to use this data
- Format for direct integration into PowerHouse Tracker algorithms

**OUTPUT FORMAT:** 
- Markdown table
- Data structure description
- Implementation notes
- Usage guidelines

**PURPOSE:** Integration into PowerHouse Tracker's automated calculation and reference systems.
```

### **Diagram Analysis**
```
Analyze this diagram/flowchart from [BOOK TITLE]:

**EXTRACT:**
- Process flow or decision tree structure
- Key decision points and criteria
- Input requirements and outputs
- Alternative pathways or options
- Implementation logic

**FORMAT:** 
- Text-based flowchart description
- Decision tree logic
- Implementation pseudocode if applicable

**TARGET:** Convert visual process into algorithmic logic for PowerHouse Tracker automation.
```

---

## 🛠️ **IMPLEMENTATION PROMPTS (For VS Code + Copilot)**

### **Component Setup Comments**
```javascript
// TODO: Implement [FEATURE] based on research extraction
// Source: [BOOK_TITLE]_Chapter[X]_[CATEGORY].md in _RESEARCH/04_READY_TO_IMPLEMENT
// 
// Research Requirements:
// - [Specific requirement 1]
// - [Specific requirement 2] 
// - [Specific requirement 3]
//
// Integration Points:
// - Update injury screening algorithm with new assessment
// - Add to system recommendation logic
// - Enhance exercise modification matrix
//
// Expected User Flow:
// 1. [Step 1]
// 2. [Step 2] 
// 3. [Step 3]
//
// Data Structure Needed:
// - [Field 1]: [Type] - [Purpose]
// - [Field 2]: [Type] - [Purpose]

// Copilot: Please suggest implementation for this component
```

### **Algorithm Integration Comments**
```javascript
// TODO: Integrate formula from research into existing algorithm
// Formula: [EXACT_FORMULA_FROM_RESEARCH]
// Variables: [VARIABLE_DEFINITIONS]
// Source: [BOOK_TITLE] Page [X]
//
// Current System Integration:
// - Input from: [existing component/state]
// - Output to: [target component/algorithm]
// - Validation: [requirements]
//
// Error Handling Needed:
// - [Edge case 1]
// - [Edge case 2]

// Copilot: Please implement this formula integration
```

---

## 📊 **TRACKING PROMPTS**

### **Progress Update Template**
```
## Multi-AI Research Session Report
**Date:** [DATE]
**Target:** [BOOK] Chapter [X] - [CATEGORY]
**Session Duration:** [TIME]

### AI Tools Used:
- **ChatGPT:** [Extraction results summary]
- **Gemini:** [Visual processing results]
- **Claude:** [Analysis outcomes]
- **Grok:** [Validation findings]

### Outputs:
- **Research Quality:** [★★★★★]
- **Implementation Priority:** [High/Medium/Low]
- **Size Estimate:** [Small/Medium/Large]
- **Ready for GitHub Issue:** [Yes/No]

### Next Steps:
- [ ] [Immediate actions]
- [ ] [Follow-up research needed]
- [ ] [Implementation dependencies]
```

**Save these templates in `_DOCS/AI_PROMPTS/` for consistent multi-AI workflow execution.**
