import React from 'react';

/**
 * Consistent page wrapper component for all pages
 * Provides sticky header, breadcrumbs, title section, and content area
 */
export default function PageLayout({
    title,
    subtitle,
    breadcrumbs,
    actions,
    children,
    className,
    contentClassName,
    glass = false,
    fullWidth = false
}) {
    return (
        <main className={`min-h-screen ${className || ''}`}>
            {/* Sticky Header */}
            <header className="sticky-header backdrop-blur-header py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div>
                        {/* Breadcrumbs Navigation */}
                        {breadcrumbs && (
                            <nav className="breadcrumb-nav mb-2">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {crumb.to ? (
                                            <a
                                                href={crumb.to}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                {crumb.label}
                                            </a>
                                        ) : (
                                            <span className="text-white">{crumb.label}</span>
                                        )}
                                        {index < breadcrumbs.length - 1 && (
                                            <span className="text-gray-500 mx-2">/</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}

                        {/* Page Title */}
                        {title && (
                            <h1 className="text-2xl md:text-3xl font-semibold text-white">
                                {title}
                            </h1>
                        )}

                        {/* Page Subtitle */}
                        {subtitle && (
                            <p className="text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {actions && (
                        <div className="flex gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            </header>

            {/* Content Section */}
            <section className={`${fullWidth ? '' : 'container mx-auto'} py-6 md:py-8`}>
                <div className={`space-y-6 ${glass ? 'glass-morphism-subtle' : ''} ${contentClassName || ''}`}>
                    {children}
                </div>
            </section>
        </main>
    );
}

/**
 * Reusable section card component for content areas
 * Provides consistent styling for page sections
 */
export function PageSection({ title, children, className = '' }) {
    return (
        <section className={`card-powerhouse premium-card space-y-4 ${className}`}>
            {title && (
                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>
            )}
            <div>
                {children}
            </div>
        </section>
    );
}
