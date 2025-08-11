import React from 'react';
import { Link } from 'react-router-dom';

export default function PowerHouseLogo({ className = '' }) {
    return (
        <Link to="/" aria-label="PowerHouseATX Home" className={`inline-flex items-center ${className}`}>
            <svg
                className="powerhouse-logo"
                width="170" height="24" viewBox="0 0 170 24" xmlns="http://www.w3.org/2000/svg" role="img"
                style={{ display: 'block' }}
            >
                {/* Wordmark */}
                <text x="0" y="17" fontFamily="Roboto, system-ui, sans-serif" fontWeight="700" fontSize="16" fill="#FFFFFF">Power</text>
                <text x="54" y="17" fontFamily="Roboto, system-ui, sans-serif" fontWeight="700" fontSize="16" fill="#FFFFFF">House</text>
                {/* ATX pill (hard-colored, not affected by external CSS) */}
                <rect data-atx="1" x="118" y="3" rx="6" ry="6" width="44" height="18" fill="#DC2626" />
                <text x="129" y="17" fontFamily="Roboto, system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF">ATX</text>
            </svg>
        </Link>
    );
}
