import React from 'react';
import { NASMProvider } from '../../../contexts/methodology/NASMContext';
import NASMMethodologyWorkflow from './NASMMethodologyWorkflow';

const NASMMethodologyEntry = () => {
    return (
        <NASMProvider>
            <div className="nasm-methodology-wrapper">
                <NASMMethodologyWorkflow />
            </div>
        </NASMProvider>
    );
};

export default NASMMethodologyEntry;
