/**
 * LEGACY REDIRECT: Macrocycle.jsx
 * This file now redirects to the unified Program builder
 * All macrocycle building is handled by /program with auto-detection
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Macrocycle() {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Redirect to unified program builder with macrocycle context
        const redirectPath = id ? `/program?macrocycleId=${id}` : '/program';

        toast.info('Redirecting to unified Program Builder...', {
            position: 'top-center',
            autoClose: 2000
        });

        console.log('🔄 Redirecting from legacy Macrocycle.jsx to unified Program builder');
        navigate(redirectPath, { replace: true });
    }, [navigate, id]);

    // Show a brief loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-white text-lg">Redirecting to Program Builder...</p>
                <p className="text-gray-400 text-sm mt-2">
                    All builders are now unified in the Program Design page
                </p>
            </div>
        </div>
    );
}
