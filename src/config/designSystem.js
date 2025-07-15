/**
 * PowerHouse Tracker Design System Configuration
 * 
 * This file contains all the design tokens and configuration for the application.
 * Modify these values to change the global appearance across all components.
 */

export const designTokens = {
    // Color Palette
    colors: {
        // Background Colors
        background: {
            primary: '#111827',    // gray-900 - Main background
            secondary: '#1f2937',  // gray-800 - Cards/sections
            tertiary: '#374151',   // gray-700 - Sub-sections
        },

        // Input & Form Colors
        input: {
            background: '#dc2626',  // red-600 - Input backgrounds (as requested)
            border: '#6b7280',      // gray-500 - Input borders
            borderFocus: '#2563eb', // blue-600 - Focused input borders
            text: '#ffffff',        // white - Input text
            placeholder: '#9ca3af', // gray-400 - Placeholder text
        },

        // Text Colors
        text: {
            primary: '#ffffff',     // white - Main headings
            secondary: '#d1d5db',   // gray-300 - Secondary text, good contrast
            muted: '#9ca3af',       // gray-400 - Muted text (use sparingly)
        },

        // Accent Colors
        accent: {
            primary: '#2563eb',     // blue-600 - Primary actions, active states
            hover: '#1d4ed8',       // blue-700 - Hover states
            success: '#16a34a',     // green-600 - Success states
            warning: '#d97706',     // amber-600 - Warning states
            danger: '#dc2626',      // red-600 - Error/danger states
        },

        // Border Colors
        border: {
            primary: '#374151',     // gray-700 - Primary borders
            secondary: '#6b7280',   // gray-500 - Secondary borders
        },
    },

    // Typography
    typography: {
        fontFamily: {
            primary: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },

    // Spacing
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
    },

    // Border Radius
    borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },

    // Transitions
    transitions: {
        fast: '0.15s ease-in-out',
        normal: '0.25s ease-in-out',
        slow: '0.3s ease-in-out',
    },
};

/**
 * Component-specific configurations
 */
export const componentConfig = {
    // Form components
    forms: {
        input: {
            defaultPadding: '0.5rem 0.75rem',
            smallPadding: '0.25rem 0.5rem',
            borderWidth: '1px',
            focusRingWidth: '3px',
            focusRingOpacity: '0.1',
        },
    },

    // Button components
    buttons: {
        defaultPadding: '0.5rem 1rem',
        smallPadding: '0.25rem 0.75rem',
        largePadding: '0.75rem 1.5rem',
    },

    // Card components
    cards: {
        defaultPadding: '1.5rem',
        headerMarginBottom: '1.5rem',
    },

    // Tab components
    tabs: {
        triggerPadding: '0.75rem 0.5rem',
        listPadding: '0.25rem',
        contentPadding: '1.5rem',
    },
};

/**
 * Responsive breakpoints
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

/**
 * Theme variants
 * 
 * You can easily switch between different color schemes by changing the active theme
 */
export const themes = {
    default: designTokens,

    // Alternative theme with different input colors
    blueInputs: {
        ...designTokens,
        colors: {
            ...designTokens.colors,
            input: {
                ...designTokens.colors.input,
                background: '#2563eb', // blue-600 instead of red
            },
        },
    },

    // High contrast theme
    highContrast: {
        ...designTokens,
        colors: {
            ...designTokens.colors,
            text: {
                primary: '#ffffff',
                secondary: '#f3f4f6',   // lighter gray for better contrast
                muted: '#d1d5db',       // lighter muted text
            },
        },
    },
};

// Export the currently active theme
export const activeTheme = themes.default;

/**
 * Utility function to generate CSS custom properties
 */
export const generateCSSCustomProperties = (theme = activeTheme) => {
    const cssVars = {};

    // Convert nested object to CSS custom properties
    const flattenObject = (obj, prefix = '') => {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const newKey = prefix ? `${prefix}-${key}` : key;

            if (typeof value === 'object' && value !== null) {
                flattenObject(value, newKey);
            } else {
                cssVars[`--${newKey}`] = value;
            }
        });
    };

    flattenObject(theme);
    return cssVars;
};

export default designTokens;
