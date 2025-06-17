export default function renderPhaseSections(phases, rootId = 'phaseSections') {
  const root = typeof rootId === 'string' ? document.getElementById(rootId) : rootId;
  if (!root || !Array.isArray(phases)) return;

  root.innerHTML = '';

  function createButton(id) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = id.replace(/^btn/, '').replace(/([A-Z])/g, ' $1').trim();
    return btn;
  }

  phases.forEach((phase) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = phase.title;
    details.appendChild(summary);
    details.dataset.level = phase.level;

    if (Array.isArray(phase.buttons)) {
      phase.buttons.forEach((id) => {
        details.appendChild(createButton(id));
      });
    }

    if (phase.blurb) {
      const blurb = document.createElement('div');
      blurb.className = 'phase-blurb';
      blurb.textContent = phase.blurb;
      details.appendChild(blurb);
    }

    root.appendChild(details);
  });

  console.info('✅ Buttons rendered:', root.querySelectorAll('button').length);
}
