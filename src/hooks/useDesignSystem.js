import React, { useMemo } from 'react';
import { activeTheme, componentConfig, generateCSSCustomProperties } from '../config/designSystem';

/**
 * Custom hook for accessing design system tokens and utilities
 */
export const useDesignSystem = () => {
    const cssCustomProperties = useMemo(() => {
        return generateCSSCustomProperties(activeTheme);
    }, []);

    const theme = useMemo(() => activeTheme, []);
    const config = useMemo(() => componentConfig, []);

    // Utility functions for common design system operations
    const utilities = useMemo(() => ({
        // Get color value by path (e.g., 'colors.input.background')
        getColor: (path) => {
            return path.split('.').reduce((obj, key) => obj?.[key], theme);
        },

        // Get spacing value
        getSpacing: (size) => {
            return theme.spacing[size] || size;
        },

        // Get typography value
        getFontSize: (size) => {
            return theme.typography.fontSize[size] || size;
        },

        // Generate component classes
        getInputClasses: (variant = 'default') => {
            const baseClasses = 'form-input';
            const variantClasses = variant === 'sm' ? 'form-input-sm' : '';
            return `${baseClasses} ${variantClasses}`.trim();
        },

        getButtonClasses: (variant = 'primary', size = 'default') => {
            const baseClasses = 'btn';
            const variantClasses = `btn-${variant}`;
            const sizeClasses = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
            return `${baseClasses} ${variantClasses} ${sizeClasses}`.trim();
        },

        // Apply CSS custom properties to an element
        applyCSSVars: (element) => {
            if (element && typeof element === 'object') {
                Object.entries(cssCustomProperties).forEach(([property, value]) => {
                    element.style.setProperty(property, value);
                });
            }
        },
    }), [theme, cssCustomProperties]);

    return {
        theme,
        config,
        cssCustomProperties,
        utilities,
    };
};

/**
 * Higher-order component that provides design system context
 */
export const withDesignSystem = (Component) => {
    return function WrappedComponent(props) {
        const designSystem = useDesignSystem();

        return <Component {...props} designSystem={designSystem} />;
    };
};

/**
 * Component that injects CSS custom properties into the document
 */
export const DesignSystemProvider = ({ children }) => {
    const { cssCustomProperties } = useDesignSystem();

    // Inject CSS custom properties into the root element
    React.useEffect(() => {
        const root = document.documentElement;
        Object.entries(cssCustomProperties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Cleanup function to remove properties when component unmounts
        return () => {
            Object.keys(cssCustomProperties).forEach((property) => {
                root.style.removeProperty(property);
            });
        };
    }, [cssCustomProperties]);

    return children;
};

export default useDesignSystem;
