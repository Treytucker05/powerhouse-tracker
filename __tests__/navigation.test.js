/**
 * @jest-environment jsdom
 */

import '../main.js';

describe('Navigation System', () => {
  beforeAll(() => {
    // Set up DOM structure for navigation
    document.body.innerHTML = `
      <nav class="main-nav">
        <button id="navMacro" class="nav-btn active">Macrocycle</button>
        <button id="navMeso" class="nav-btn">Mesocycle</button>
        <button id="navMicro" class="nav-btn">Microcycle</button>
        <button id="navTrack" class="nav-btn">Tracking</button>
      </nav>
      
      <section id="macrocycleSection">Macrocycle Content</section>
      <section id="mesocycleSection" style="display: none;">Mesocycle Content</section>
      <section id="microcycleSection" style="display: none;">Microcycle Content</section>
      <section id="trackingSection" style="display: none;">Tracking Content</section>
    `;
  });

  test('navigation buttons should exist', () => {
    expect(document.getElementById('navMacro')).toBeTruthy();
    expect(document.getElementById('navMeso')).toBeTruthy();
    expect(document.getElementById('navMicro')).toBeTruthy();
    expect(document.getElementById('navTrack')).toBeTruthy();
  });

  test('navigation sections should exist', () => {
    expect(document.getElementById('macrocycleSection')).toBeTruthy();
    expect(document.getElementById('mesocycleSection')).toBeTruthy();
    expect(document.getElementById('microcycleSection')).toBeTruthy();
    expect(document.getElementById('trackingSection')).toBeTruthy();
  });

  test('showSection function should be exposed', () => {
    expect(typeof window.showSection).toBe('function');
  });

  test('initNavigation function should be exposed', () => {
    expect(typeof window.initNavigation).toBe('function');
  });

  test('clicking nav buttons should show correct section', () => {
    // Initialize navigation first
    if (window.initNavigation) {
      window.initNavigation();
    }

    // Test mesocycle button
    const mesoButton = document.getElementById('navMeso');
    const mesoSection = document.getElementById('mesocycleSection');
    const macroSection = document.getElementById('macrocycleSection');

    // Click mesocycle button
    mesoButton.click();

    // Check that mesocycle section is visible and others are hidden
    expect(mesoSection.style.display).toBe('block');
    expect(macroSection.style.display).toBe('none');

    // Test tracking button
    const trackButton = document.getElementById('navTrack');
    const trackSection = document.getElementById('trackingSection');

    // Click tracking button
    trackButton.click();

    // Check that tracking section is visible and mesocycle is hidden
    expect(trackSection.style.display).toBe('block');
    expect(mesoSection.style.display).toBe('none');
  });

  test('active button class should update correctly', () => {
    // Initialize navigation
    if (window.initNavigation) {
      window.initNavigation();
    }

    const macroButton = document.getElementById('navMacro');
    const mesoButton = document.getElementById('navMeso');
    const microButton = document.getElementById('navMicro');

    // Initially macro should be active
    expect(macroButton.classList.contains('active')).toBe(true);
    expect(mesoButton.classList.contains('active')).toBe(false);

    // Click microcycle button
    microButton.click();

    // Check that microcycle button is now active
    expect(microButton.classList.contains('active')).toBe(true);
    expect(macroButton.classList.contains('active')).toBe(false);
    expect(mesoButton.classList.contains('active')).toBe(false);
  });

  test('navigation should dispatch section change events', () => {
    let eventFired = false;
    let eventDetail = null;

    // Listen for navigation event
    window.addEventListener('navigation-section-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    // Initialize navigation
    if (window.initNavigation) {
      window.initNavigation();
    }

    // Click a button to trigger event
    const trackButton = document.getElementById('navTrack');
    trackButton.click();

    // Check that event was fired with correct details
    expect(eventFired).toBe(true);
    expect(eventDetail.sectionId).toBe('trackingSection');
  });
});
