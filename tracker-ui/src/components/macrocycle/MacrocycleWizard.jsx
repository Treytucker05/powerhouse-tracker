import React from 'react';
import { useTrainingState } from "../../lib/state/trainingState";
import StepIndicator from "./StepIndicator";
import ProfileStep from "./steps/ProfileStep";
import VolumeLandmarksStep from "./steps/VolumeLandmarksStep";
import PeriodizationStep from "./steps/PeriodizationStep";
import SpecializationStep from "./steps/SpecializationStep";
import ReviewStep from "./steps/ReviewStep";

export default function MacrocycleWizard() {
  const { wizardStep, userProfile } = useTrainingState(state => state.macrocycle);

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <ProfileStep />;
      case 2:
        return <VolumeLandmarksStep />;
      case 3:
        return <PeriodizationStep />;
      case 4:
        // Show specialization step only for advanced users
        if (userProfile.trainingAge === 'advanced') {
          return <SpecializationStep />;
        }
        return <ReviewStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <ProfileStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Macrocycle Planning Wizard
          </h1>
          <p className="text-gray-300 text-lg">
            Create your personalized long-term training plan
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator 
          step={wizardStep} 
          total={userProfile.trainingAge === 'advanced' ? 5 : 4} 
        />

        {/* Step Content */}
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
