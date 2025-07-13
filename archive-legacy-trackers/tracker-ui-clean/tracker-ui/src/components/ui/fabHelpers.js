import { PlayIcon, PencilIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export const PlanningActions = {
  mesocycle: [
    {
      icon: PlayIcon,
      label: 'Start New Mesocycle',
      onClick: () => console.log('Start new mesocycle')
    },
    {
      icon: PencilIcon,
      label: 'Edit Current Plan',
      onClick: () => console.log('Edit current plan')
    }
  ],
  microcycle: [
    {
      icon: ArrowRightIcon,
      label: 'Start Week',
      onClick: () => console.log('Start week')
    },
    {
      icon: PencilIcon,
      label: 'Edit Weekly Plan',
      onClick: () => console.log('Edit weekly plan')
    }
  ]
};
