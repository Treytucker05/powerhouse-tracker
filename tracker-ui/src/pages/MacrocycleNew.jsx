import React, { useEffect } from 'react';
import { useTrainingState } from "../lib/state/trainingState";
import MacrocycleWizard from "../components/macrocycle/MacrocycleWizard";
import PhaseTimeline from "../components/macrocycle/timeline/PhaseTimeline";
import { createYearlyPlan } from "../lib/algorithms/macrocyclePlanner";

export default function MacrocyclePage() {
  const {
    userProfile, currentPlan, isComplete, setPlan
  } = useTrainingState(state => state.macrocycle);

  // run generator after wizard completes
  useEffect(() => {
    if (isComplete && !currentPlan && Object.keys(userProfile).length > 0) {
      const plan = createYearlyPlan(userProfile);
      setPlan(plan);
    }
  }, [isComplete, currentPlan, userProfile, setPlan]);

  if (!isComplete) return <MacrocycleWizard />;

  return <PhaseTimeline plan={currentPlan} />;
}
