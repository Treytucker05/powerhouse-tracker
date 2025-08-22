# Variants System

## Overview

The 5/3/1 Builder supports variant selection for each main lift, allowing users to customize their program while maintaining consistent loading patterns.

## Key Invariants

1. **Load Consistency**: All variants within the same base family use identical percentage and rep schemes. Only the display name and exercise selection changes.

2. **Base Families**: Each lift category has a canonical base variant:
   - **Press**: `overhead_press` (base)
   - **Bench**: `bench_press` (base) 
   - **Squat**: `back_squat` (base)
   - **Deadlift**: `conventional_deadlift` (base)

3. **Variant Substitution**: Variants are purely cosmetic/exercise selection - they don't affect training max calculations or percentage progressions.

## Implementation

### Registry (`src/lib/variants/registry.ts`)
- Central registry of all available variants
- Maps variant codes to human-readable labels
- Defines base lift families
- Provides helper functions for variant resolution

### UI Integration
- **Step 1**: Variant selection via radio toggle (Base/Variant) and dropdown
- **Step 3**: Variant badge showing count of customized lifts
- **Step 4**: Variant labels displayed in preview cards and export metadata

### Data Flow
1. User selects variants in Step 1 → stored in `BuilderState.step1.variants`
2. Generator receives variants but doesn't alter load calculations
3. Preview displays chosen variant labels using `variantLabel()` helper
4. Export includes both variant codes and human-readable labels

### Testing
- Generator tests validate that variant selection doesn't affect load patterns
- UI tests ensure variant selection persists through navigation
- Rotation tests verify variant integration doesn't break existing functionality

## Usage Example

```typescript
// Select incline bench instead of flat bench
const step1State = {
  variants: {
    bench: 'incline_bench_press'  // instead of default 'bench_press'
  }
};

// This generates identical loads but different display labels
const program = generate531Program({
  variants: step1State.variants,
  // ... other params
});

// Preview shows "Incline Bench Press" instead of "Bench Press"
const label = variantLabel('incline_bench_press'); // "Incline Bench Press"
```

## Extension

To add new variants:

1. Update `VARIANT_REGISTRY` in `registry.ts`
2. Ensure new variant maps to correct base family
3. Add human-readable label
4. No generator changes needed (loads remain consistent)

## Migration Notes

- Existing programs without variant selection default to base variants
- Variant codes are backward-compatible (no breaking changes to existing exports)
- Future UI improvements can add variant descriptions, form cues, etc. without affecting core generation logic
