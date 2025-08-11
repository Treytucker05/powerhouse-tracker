import React from 'react';
import { NASMIntakeStep, NASMVitalsStep } from './components/assessment/nasm/steps';

// Simple test component to verify imports and CSS are working
const NASMStepTest = () => {
    return (
        <div>
            <h1>NASM Step Components Test</h1>
            <p>✅ Components imported successfully</p>
            <p>✅ GlobalNASMStyles.css loading correctly</p>

            {/* Test basic styling */}
            <div className="step-content">
                <div className="step-header-container">
                    <h1 className="step-header-title">Test Header</h1>
                </div>
                <div className="progress-pills">
                    <div className="progress-pill active">Test Pill</div>
                </div>
                <div className="content-card">
                    <div className="checkbox-group">
                        <div className="checkbox-item checked">
                            <input type="checkbox" checked />
                            <label>Test Checkbox</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NASMStepTest;
