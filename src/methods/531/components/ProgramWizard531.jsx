import React from 'react';
import Step2TemplateGallery from './Step2TemplateGallery';

export default function ProgramWizard531({ initialStep = 2 }) {
    const step = initialStep || 2;
    return (
        <div className="min-h-[60vh] p-4">
            {step === 2 ? (
                <Step2TemplateGallery />
            ) : (
                <div className="text-gray-400 text-sm">This minimal wizard only implements Step 2.</div>
            )}
        </div>
    );
}
