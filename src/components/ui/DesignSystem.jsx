import React from 'react';

// Page Layout Components
export const AppContainer = ({ children, className = '' }) => (
    <div className={`app-container ${className}`}>
        {children}
    </div>
);

export const ContentContainer = ({ children, className = '' }) => (
    <div className={`content-container ${className}`}>
        {children}
    </div>
);

export const PageHeader = ({ title, description, children, className = '' }) => (
    <div className={`page-header ${className}`}>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
        {children}
    </div>
);

// Card Components
export const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ title, description, children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {description && <p className="card-description">{description}</p>}
        {children}
    </div>
);

// Form Components
export const FormGroup = ({ children, className = '' }) => (
    <div className={`form-group ${className}`}>
        {children}
    </div>
);

export const FormLabel = ({ children, htmlFor, className = '' }) => (
    <label htmlFor={htmlFor} className={`form-label ${className}`}>
        {children}
    </label>
);

export const FormInput = ({
    type = 'text',
    size = 'default',
    className = '',
    ...props
}) => {
    const sizeClass = size === 'sm' ? 'form-input-sm' : '';
    return (
        <input
            type={type}
            className={`form-input ${sizeClass} ${className}`}
            {...props}
        />
    );
};

export const FormSelect = ({ children, className = '', ...props }) => (
    <select className={`form-select ${className}`} {...props}>
        {children}
    </select>
);

export const FormTextarea = ({ className = '', ...props }) => (
    <textarea className={`form-textarea ${className}`} {...props} />
);

// Button Components
export const Button = ({
    variant = 'primary',
    size = 'default',
    children,
    className = '',
    ...props
}) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

    return (
        <button
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const LinkButton = ({
    variant = 'primary',
    size = 'default',
    children,
    className = '',
    ...props
}) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

    return (
        <a
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </a>
    );
};

// Progress Components
export const ProgressContainer = ({ children, className = '' }) => (
    <div className={`progress-container ${className}`}>
        {children}
    </div>
);

export const ProgressHeader = ({ label, value, className = '' }) => (
    <div className={`progress-header ${className}`}>
        <span className="progress-label">{label}</span>
        <span className="progress-label">{value}</span>
    </div>
);

export const ProgressBar = ({ value, className = '' }) => (
    <div className={`progress-bar-container ${className}`}>
        <div
            className="progress-bar"
            style={{ width: `${value}%` }}
        />
    </div>
);

// Section Components
export const Section = ({ children, className = '' }) => (
    <div className={`section ${className}`}>
        {children}
    </div>
);

export const SectionHeader = ({ title, description, children, className = '' }) => (
    <div className={`section-header ${className}`}>
        {title && <h3 className="section-title">{title}</h3>}
        {description && <p className="section-description">{description}</p>}
        {children}
    </div>
);

// Grid Components
export const Grid = ({ columns = 2, children, className = '' }) => {
    const gridClass = `grid-${columns}`;
    return (
        <div className={`${gridClass} ${className}`}>
            {children}
        </div>
    );
};

// Enhanced Tab Components
export const TabList = ({ children, className = '' }) => (
    <div className={`tab-list ${className}`}>
        {children}
    </div>
);

export const TabTrigger = ({
    active = false,
    onClick,
    children,
    className = ''
}) => {
    const activeClass = active ? 'active' : '';
    return (
        <button
            className={`tab-trigger ${activeClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const TabContent = ({ children, className = '' }) => (
    <div className={`tab-content card ${className}`}>
        {children}
    </div>
);

// Input Field Component (standardized form input with label)
export const InputField = ({
    label,
    type = 'text',
    required = false,
    error,
    helperText,
    size = 'default',
    className = '',
    ...props
}) => (
    <FormGroup className={className}>
        <FormLabel>
            {label}
            {required && <span className="text-danger ml-1">*</span>}
        </FormLabel>
        <FormInput type={type} size={size} {...props} />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
        {helperText && <p className="text-muted text-sm mt-1">{helperText}</p>}
    </FormGroup>
);

// Select Field Component
export const SelectField = ({
    label,
    options = [],
    required = false,
    error,
    helperText,
    className = '',
    ...props
}) => (
    <FormGroup className={className}>
        <FormLabel>
            {label}
            {required && <span className="text-danger ml-1">*</span>}
        </FormLabel>
        <FormSelect {...props}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </FormSelect>
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
        {helperText && <p className="text-muted text-sm mt-1">{helperText}</p>}
    </FormGroup>
);

// Textarea Field Component
export const TextareaField = ({
    label,
    required = false,
    error,
    helperText,
    className = '',
    ...props
}) => (
    <FormGroup className={className}>
        <FormLabel>
            {label}
            {required && <span className="text-danger ml-1">*</span>}
        </FormLabel>
        <FormTextarea {...props} />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
        {helperText && <p className="text-muted text-sm mt-1">{helperText}</p>}
    </FormGroup>
);
