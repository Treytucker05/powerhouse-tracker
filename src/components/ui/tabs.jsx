import React, { createContext, useContext } from 'react';

const TabsContext = createContext();

export const Tabs = ({ value, onValueChange, className, children }) => {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ className, children }) => {
    return (
        <div className={`inline-flex h-10 items-center justify-center rounded-md p-1 ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({ value, className, children, title }) => {
    const { value: selectedValue, onValueChange } = useContext(TabsContext);
    const isActive = selectedValue === value;

    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className} ${isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted hover:text-muted-foreground'
                }`}
            onClick={() => onValueChange(value)}
            title={title}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, className, children }) => {
    const { value: selectedValue } = useContext(TabsContext);

    if (selectedValue !== value) {
        return null;
    }

    return (
        <div className={`ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
            {children}
        </div>
    );
};
