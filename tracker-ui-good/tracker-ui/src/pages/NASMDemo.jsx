import React from 'react';
import StreamlinedProgram from '../pages/StreamlinedProgram';

/**
 * NASM Demo Page - Test the complete 17-step NASM workflow
 */

const NASMDemo = () => {
    return (
        <div className="nasm-demo">
            <div className="demo-header">
                <h1>🎯 NASM OPT Program Design Demo</h1>
                <p>Complete 17-step methodology implementation</p>
                <div className="demo-instructions">
                    <h3>How to use:</h3>
                    <ol>
                        <li>Select "NASM OPT Model" from the methodology options</li>
                        <li>Follow the 17-step process through all phases</li>
                        <li>Currently implemented: Steps 1-4 (Intake, Vitals, Posture, Movement)</li>
                        <li>Steps 5-17 show placeholders with skip functionality</li>
                    </ol>
                </div>
            </div>

            <div className="demo-content">
                <StreamlinedProgram />
            </div>

            <style jsx>{`
                .nasm-demo {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .demo-header {
                    background: #f0f9ff;
                    border: 1px solid #0ea5e9;
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 30px;
                    text-align: center;
                }

                .demo-header h1 {
                    color: #0c4a6e;
                    margin: 0 0 10px 0;
                }

                .demo-header p {
                    color: #0369a1;
                    font-size: 18px;
                    margin: 0 0 20px 0;
                }

                .demo-instructions {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: left;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .demo-instructions h3 {
                    color: #1e40af;
                    margin: 0 0 15px 0;
                }

                .demo-instructions ol {
                    margin: 0;
                    padding-left: 20px;
                }

                .demo-instructions li {
                    margin-bottom: 8px;
                    color: #374151;
                }

                .demo-content {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default NASMDemo;
