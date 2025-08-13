import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

const TimelineStep = () => {
  const { state, actions } = useProgramContext();
  const [selectedCategory, setSelectedCategory] = useState('mesocycle');

  // Timeline categories with comprehensive options
  const timelineCategories = {
    mesocycle: {
      name: 'Mesocycles',
      description: 'Short-term focused training blocks (2-8 weeks)',
      icon: '🔄',
      options: [
        { weeks: 2, label: '2 weeks', description: 'Deload/Taper block' },
        { weeks: 3, label: '3 weeks', description: 'Intensity focus block' },
        { weeks: 4, label: '4 weeks', description: 'Standard mesocycle' },
        { weeks: 6, label: '6 weeks', description: 'Extended volume block' },
        { weeks: 8, label: '8 weeks', description: 'Strength/Power block' }
      ]
    },
    macrocycle: {
      name: 'Macrocycles (Medium)',
      description: 'Medium-term training phases (8-24 weeks)',
      icon: '📅',
      options: [
        { weeks: 8, label: '8 weeks', description: 'Competition prep cycle' },
        { weeks: 12, label: '12 weeks', description: 'Standard training cycle' },
        { weeks: 16, label: '16 weeks', description: 'Extended development' },
        { weeks: 20, label: '20 weeks', description: 'Comprehensive preparation' },
        { weeks: 24, label: '24 weeks', description: 'Long-term development' }
      ]
    },
    macrocycle_long: {
      name: 'Macrocycles (Long-term)',
      description: 'Long-term athletic development (6 months - 2 years)',
      icon: '🎯',
      options: [
        { weeks: 26, label: '6 months', description: 'Seasonal preparation' },
        { weeks: 39, label: '9 months', description: 'Extended season' },
        { weeks: 52, label: '1 year', description: 'Annual training plan' },
        { weeks: 78, label: '18 months', description: 'Olympic cycle (partial)' },
        { weeks: 104, label: '2 years', description: 'Full Olympic cycle' }
      ]
    },
    custom: {
      name: 'Custom Duration',
      description: 'Set your own specific timeline',
      icon: '⚙️',
      options: []
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Clear current selection when switching categories
    if (state.timeline?.category !== category) {
      actions.updateTimeline({ category, weeks: null, customWeeks: null });
    }
  };

  const handleDurationSelect = (weeks, description) => {
    actions.updateTimeline({
      category: selectedCategory,
      weeks,
      description,
      customWeeks: null
    });
  };

  const handleCustomWeeksChange = (customWeeks) => {
    actions.updateTimeline({
      category: 'custom',
      weeks: parseInt(customWeeks),
      customWeeks: parseInt(customWeeks),
      description: `Custom ${customWeeks} week program`
    });
  };

  return (
    <div className="timeline-step">
      <div className="step-header">
        <h2>⏱️ Timeline & Duration</h2>
        <p className="step-description">
          Choose your program duration and periodization timeline
        </p>
      </div>

      {/* Timeline Category Selection */}
      <div className="content-section">
        <h3>Program Timeline Category</h3>
        <div className="category-selector">
          {Object.entries(timelineCategories).map(([key, category]) => (
            <div
              key={key}
              className={`category-option ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-content">
                <h4>{category.name}</h4>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duration Options for Selected Category */}
      {selectedCategory !== 'custom' && (
        <div className="content-section">
          <h3>{timelineCategories[selectedCategory].name} Options</h3>
          <div className="duration-grid">
            {timelineCategories[selectedCategory].options.map(option => (
              <div
                key={option.weeks}
                className={`duration-option ${state.timeline?.weeks === option.weeks ? 'active' : ''}`}
                onClick={() => handleDurationSelect(option.weeks, option.description)}
              >
                <div className="duration-label">{option.label}</div>
                <div className="duration-description">{option.description}</div>
                <div className="duration-weeks">{option.weeks} weeks</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Duration Input */}
      {selectedCategory === 'custom' && (
        <div className="content-section">
          <h3>Custom Duration</h3>
          <div className="custom-duration">
            <label htmlFor="customWeeks">Number of weeks:</label>
            <input
              id="customWeeks"
              type="number"
              min="1"
              max="208"
              value={state.timeline?.customWeeks || ''}
              onChange={(e) => handleCustomWeeksChange(e.target.value)}
              placeholder="Enter weeks (1-208)"
            />
            <span className="custom-note">Maximum: 4 years (208 weeks)</span>
          </div>
        </div>
      )}

      {/* Selected Timeline Summary */}
      {state.timeline?.weeks && (
        <div className="content-section">
          <h3>Selected Timeline</h3>
          <div className="timeline-summary">
            <div className="summary-item">
              <strong>Duration:</strong> {state.timeline.weeks} weeks
            </div>
            <div className="summary-item">
              <strong>Category:</strong> {timelineCategories[state.timeline.category || selectedCategory].name}
            </div>
            <div className="summary-item">
              <strong>Description:</strong> {state.timeline.description}
            </div>
            <div className="summary-item">
              <strong>Approximate Phases:</strong>
              {state.timeline.weeks <= 4 && ' Single focused block'}
              {state.timeline.weeks > 4 && state.timeline.weeks <= 12 && ' 2-3 training phases'}
              {state.timeline.weeks > 12 && state.timeline.weeks <= 24 && ' 3-4 training phases'}
              {state.timeline.weeks > 24 && state.timeline.weeks <= 52 && ' 4-6 training phases'}
              {state.timeline.weeks > 52 && ' Multiple seasonal phases'}
            </div>
          </div>
        </div>
      )}

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep(2)}
        >
          ← Back
        </button>

        <button
          className="btn-primary"
          disabled={!state.timeline?.weeks}
          onClick={() => actions.setCurrentStep(4)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default TimelineStep;
