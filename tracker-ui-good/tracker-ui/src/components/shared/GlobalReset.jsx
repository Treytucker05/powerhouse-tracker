import { useEffect } from 'react';

/**
 * GlobalReset - CSS Reset Utility Component
 * 
 * This component serves as a CSS reset utility that ensures consistent styling
 * across the application by programmatically injecting global styles. It acts
 * as a fallback mechanism when CSS files may not load properly or when dynamic
 * content needs consistent styling overrides.
 * 
 * Key Functions:
 * - Forces all text to be white (#ffffff) with Roboto font family
 * - Overrides any blue text colors that might interfere with the dark theme
 * - Ensures form elements maintain consistent styling
 * - Provides PowerHouse theme compatibility for dynamic content
 * 
 * Usage: Import and include in App.jsx - renders nothing but applies global styles
 */
const GlobalReset = () => {
    useEffect(() => {
        // Force global styles on mount
        const applyGlobalStyles = () => {
            // Add global styles to document
            const style = document.createElement('style');
            style.innerHTML = `
        *, *::before, *::after {
          font-family: 'Roboto', sans-serif !important;
          color: #ffffff !important;
        }
        
        body {
          background-color: #111827 !important;
          color: #ffffff !important;
          font-family: 'Roboto', sans-serif !important;
        }
        
        /* Override any blue text that might appear */
        .text-blue-500, .text-blue-600, .text-blue-700, .text-blue-800,
        .text-indigo-500, .text-indigo-600 {
          color: #ffffff !important;
        }
        
        /* Ensure form elements are properly styled */
        input, select, textarea, button {
          color: #ffffff !important;
          font-family: 'Roboto', sans-serif !important;
        }
        
        input:focus, select:focus, textarea:focus {
          color: #ffffff !important;
        }
        
        /* Radio buttons and checkboxes */
        input[type="radio"], input[type="checkbox"] {
          accent-color: #dc2626 !important;
        }
        
        /* Progress pills and navigation */
        .phase-pill, .step-nav, .progress-pill {
          color: #ffffff !important;
        }
      `;

            // Add to head if not already present
            if (!document.querySelector('#global-reset-styles')) {
                style.id = 'global-reset-styles';
                document.head.appendChild(style);
            }
        };

        // Apply styles immediately
        applyGlobalStyles();

        // Also apply after a short delay to catch any dynamic content
        const timeout = setTimeout(applyGlobalStyles, 100);

        return () => {
            clearTimeout(timeout);
            // Optional: remove styles on unmount
            const existingStyle = document.querySelector('#global-reset-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    return null; // This component doesn't render anything
};

export default GlobalReset;
