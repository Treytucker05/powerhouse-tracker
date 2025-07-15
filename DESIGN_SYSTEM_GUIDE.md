# PowerHouse Tracker Design System

This design system provides a centralized way to manage colors, typography, spacing, and components across the entire application. You can now set up your styling once and forget about it!

## Quick Start

### 1. The Design System is Automatically Available

The design system is imported in `src/index.css` and provides CSS custom properties and utility classes that work across all components.

### 2. Use Standardized Components

Instead of writing custom styled components, use the pre-built design system components:

```jsx
import {
  Card,
  CardHeader,
  FormInput,
  FormSelect,
  Button,
  InputField
} from '../components/ui/DesignSystem';

// Old way (with manual styling)
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
  <input className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white" />
</div>

// New way (with design system)
<Card>
  <FormInput />
</Card>
```

### 3. Use CSS Classes

You can also use the standardized CSS classes directly:

```jsx
// Form inputs automatically get red backgrounds
<input className="form-input" />
<select className="form-select" />
<textarea className="form-textarea" />

// Cards and layouts
<div className="card">
  <div className="card-header">
    <h2 className="card-title">Title</h2>
    <p className="card-description">Description</p>
  </div>
</div>
```

## Color System

### Background Colors
- `--bg-primary`: #111827 (Main page background)
- `--bg-secondary`: #1f2937 (Cards and sections)
- `--bg-tertiary`: #374151 (Sub-sections)

### Input Colors (Red as requested)
- `--input-bg`: #dc2626 (Red background for all inputs)
- `--input-border`: #6b7280 (Gray borders)
- `--input-text`: #ffffff (White text)

### Text Colors
- `--text-primary`: #ffffff (Main headings)
- `--text-secondary`: #d1d5db (Secondary text - good contrast)
- `--text-muted`: #9ca3af (Muted text)

## Components Reference

### Layout Components

```jsx
import { AppContainer, ContentContainer, PageHeader } from '../components/ui/DesignSystem';

<AppContainer>
  <ContentContainer>
    <PageHeader 
      title="Page Title"
      description="Page description"
    />
  </ContentContainer>
</AppContainer>
```

### Form Components

```jsx
import { InputField, SelectField, TextareaField, Button } from '../components/ui/DesignSystem';

// Simple input with label
<InputField 
  label="Name"
  placeholder="Enter name"
  required
/>

// Select with options
<SelectField 
  label="Category"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
/>

// Textarea
<TextareaField 
  label="Description"
  rows={4}
/>

// Buttons
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
```

### Card Components

```jsx
import { Card, CardHeader, Section, SectionHeader } from '../components/ui/DesignSystem';

<Card>
  <CardHeader 
    title="Card Title"
    description="Card description"
  />
  
  <Section>
    <SectionHeader 
      title="Section Title"
      description="Section description"
    />
    {/* Section content */}
  </Section>
</Card>
```

### Grid Layouts

```jsx
import { Grid } from '../components/ui/DesignSystem';

<Grid columns={2}>
  <div>Column 1</div>
  <div>Column 2</div>
</Grid>

<Grid columns={3}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</Grid>
```

## Customizing Colors Globally

### Method 1: Update CSS Custom Properties

Edit `src/styles/design-system.css` and change the `:root` variables:

```css
:root {
  /* Change input color from red to blue */
  --input-bg: #2563eb;  /* blue-600 instead of red-600 */
  
  /* Change text contrast */
  --text-secondary: #f3f4f6;  /* lighter gray for better contrast */
}
```

### Method 2: Update Design Token Configuration

Edit `src/config/designSystem.js`:

```javascript
export const designTokens = {
  colors: {
    input: {
      background: '#2563eb',  // Change from red to blue
      // ... other properties stay the same
    },
  },
};
```

### Method 3: Switch to a Different Theme

```javascript
// In src/config/designSystem.js
export const activeTheme = themes.blueInputs;  // Switch to blue inputs
```

## CSS Classes Reference

### Form Classes
- `.form-input` - Standard input styling (red background, white text)
- `.form-input-sm` - Small input variant
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form label styling

### Button Classes
- `.btn` - Base button class
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Gray secondary button
- `.btn-danger` - Red danger button
- `.btn-success` - Green success button

### Layout Classes
- `.card` - Card container
- `.card-header` - Card header section
- `.card-title` - Card title text
- `.card-description` - Card description text
- `.section` - Section container
- `.grid-2`, `.grid-3`, `.grid-4` - Grid layouts

### Utility Classes
- `.text-primary`, `.text-secondary`, `.text-muted` - Text colors
- `.bg-primary`, `.bg-secondary`, `.bg-tertiary` - Background colors
- `.rounded`, `.rounded-lg` - Border radius
- `.shadow-sm`, `.shadow-md`, `.shadow-lg` - Box shadows

## Migration Guide

### Converting Existing Components

1. **Replace manual Tailwind classes with design system classes:**

```jsx
// Before
<input className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" />

// After
<input className="form-input" />
```

2. **Use standardized components:**

```jsx
// Before
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
  <h2 className="text-xl font-semibold text-white mb-2">Title</h2>
  <p className="text-gray-300 text-sm">Description</p>
</div>

// After
<Card>
  <CardHeader title="Title" description="Description" />
</Card>
```

3. **Replace color variables:**

```jsx
// Before
<div className="bg-gray-900">
  <div className="bg-gray-800">
    <span className="text-gray-300">Text</span>
  </div>
</div>

// After
<div className="bg-primary">
  <div className="bg-secondary">
    <span className="text-secondary">Text</span>
  </div>
</div>
```

## Benefits

1. **Consistency**: All components use the same color scheme automatically
2. **Maintainability**: Change colors in one place, applies everywhere
3. **Performance**: CSS custom properties are more efficient than inline styles
4. **Accessibility**: Standardized contrast ratios and color combinations
5. **Developer Experience**: Pre-built components reduce boilerplate code
6. **Flexibility**: Easy to switch themes or make global changes

## Examples

### Example 1: Creating a New Page

```jsx
import React from 'react';
import { 
  AppContainer, 
  ContentContainer, 
  PageHeader, 
  Card, 
  CardHeader,
  InputField,
  Button,
  Grid
} from '../components/ui/DesignSystem';

const NewPage = () => {
  return (
    <AppContainer>
      <ContentContainer>
        <PageHeader 
          title="New Feature"
          description="This page automatically uses the design system"
        />
        
        <Card>
          <CardHeader 
            title="Form Section"
            description="All inputs will have red backgrounds automatically"
          />
          
          <Grid columns={2}>
            <InputField label="First Name" />
            <InputField label="Last Name" />
          </Grid>
          
          <InputField label="Email" type="email" />
          
          <div className="mt-4">
            <Button variant="primary">Save</Button>
            <Button variant="secondary" className="ml-2">Cancel</Button>
          </div>
        </Card>
      </ContentContainer>
    </AppContainer>
  );
};
```

### Example 2: Quick Color Theme Switch

To change all input backgrounds from red to blue:

```javascript
// In src/config/designSystem.js, change one line:
export const activeTheme = themes.blueInputs;
```

That's it! All input fields across the entire application will now use blue backgrounds instead of red.
