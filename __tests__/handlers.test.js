/**
 * @jest-environment jsdom
 */

import '../main.js';

describe('Button Handlers', () => {
  beforeAll(() => {
    // Ensure DOM is ready
    document.body.innerHTML = `
      <button id="btnBeginnerPreset">Beginner Preset</button>
      <button id="btnIntermediatePreset">Intermediate Preset</button>
      <button id="btnAdvancedPreset">Advanced Preset</button>
      <button id="btnCustomConfiguration">Custom Configuration</button>
      <button id="btnSetupMesocycle"></button>
      <button id="btnShowRIRSchedule"></button>
      <button id="btnGenerateWeeklyProgram"></button>
      <button id="btnSmartExerciseSelection"></button>
      <button id="btnRiskAssessment"></button>
      <button id="btnRunWeeklyAutoProgression"></button>
      <button id="btnNextWeek"></button>
      <button id="btnProcessWeeklyAdjustments"></button>
      <button id="btnWeeklyIntelligenceReport"></button>
      <button id="btnPredictDeloadTiming"></button>
    `;
  });

  test('btnBeginnerPreset should be exposed as a function', () => {
    expect(typeof window.btnBeginnerPreset).toBe('function');
    expect(window.btnBeginnerPreset.name).toBe('beginnerPreset');
  });

  test('btnIntermediatePreset should be exposed as a function', () => {
    expect(typeof window.btnIntermediatePreset).toBe('function');
    expect(window.btnIntermediatePreset.name).toBe('intermediatePreset');
  });

  test('btnAdvancedPreset should be exposed as a function', () => {
    expect(typeof window.btnAdvancedPreset).toBe('function');
    expect(window.btnAdvancedPreset.name).toBe('advancedPreset');
  });

  test('btnCustomConfiguration should be exposed as a function', () => {
    expect(typeof window.btnCustomConfiguration).toBe('function');
    expect(window.btnCustomConfiguration.name).toBe('customConfiguration');
  });

  test('btnSetupMesocycle should be exposed as a function', () => {
    expect(typeof window.btnSetupMesocycle).toBe('function');
  });

  test('btnShowRIRSchedule should be exposed as a function', () => {
    expect(typeof window.btnShowRIRSchedule).toBe('function');
  });

  test('btnGenerateWeeklyProgram should be exposed as a function', () => {
    expect(typeof window.btnGenerateWeeklyProgram).toBe('function');
  });

  test('btnSmartExerciseSelection should be exposed as a function', () => {
    expect(typeof window.btnSmartExerciseSelection).toBe('function');
  });

  test('btnRiskAssessment should be exposed as a function', () => {
    expect(typeof window.btnRiskAssessment).toBe('function');
  });

  test('btnRunWeeklyAutoProgression should be exposed as a function', () => {
    expect(typeof window.btnRunWeeklyAutoProgression).toBe('function');
  });

  test('btnNextWeek should be exposed as a function', () => {
    expect(typeof window.btnNextWeek).toBe('function');
  });

  test('btnProcessWeeklyAdjustments should be exposed as a function', () => {
    expect(typeof window.btnProcessWeeklyAdjustments).toBe('function');
  });

  test('btnWeeklyIntelligenceReport should be exposed as a function', () => {
    expect(typeof window.btnWeeklyIntelligenceReport).toBe('function');
  });

  test('btnPredictDeloadTiming should be exposed as a function', () => {
    expect(typeof window.btnPredictDeloadTiming).toBe('function');
  });

  test('all handlers should not contain TODO or stub in their source', () => {
    const handlers = [
      'btnBeginnerPreset',
      'btnIntermediatePreset', 
      'btnAdvancedPreset',
      'btnCustomConfiguration'
    ];

    handlers.forEach(handlerName => {
      const handler = window[handlerName];
      expect(handler).toBeDefined();
      expect(typeof handler).toBe('function');
      
      const source = handler.toString();
      expect(source).not.toMatch(/TODO|stub/i);
    });
  });  test('handlers should dispatch proper events when called', () => {
    let eventFired = false;
    window.addEventListener('beginner-preset-selected', () => {
      eventFired = true;
    });
    
    window.btnBeginnerPreset();
    
    expect(eventFired).toBe(true);
    expect(window.trainingState.currentPreset).toBe('beginner');
  });
});
