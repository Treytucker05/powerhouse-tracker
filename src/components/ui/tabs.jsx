import React, { createContext, useContext } from 'react';

// Tabs Context for state management
const TabsContext = createContext();

// Main Tabs component
export const Tabs = ({ value, onValueChange, className = '', children, ...props }) => {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={`tabs ${className}`} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

// TabsList component
export const TabsList = ({ className = '', children, ...props }) => {
    return (
        <div className={`tabs-list ${className}`} {...props}>
            {children}
        </div>
    );
};

// TabsTrigger component
export const TabsTrigger = ({ value, className = '', children, ...props }) => {
    const { value: activeValue, onValueChange } = useContext(TabsContext);
    const isActive = activeValue === value;

    return (
        <button
            className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
            onClick={() => onValueChange?.(value)}
            {...props}
        >
            {children}
        </button>
    );
};

// TabsContent component
export const TabsContent = ({ value, className = '', children, ...props }) => {
    const { value: activeValue } = useContext(TabsContext);
    const isActive = activeValue === value;

    if (!isActive) return null;

    return (
        <div className={`tabs-content ${className}`} {...props}>
            {children}
        </div>
    );
};
