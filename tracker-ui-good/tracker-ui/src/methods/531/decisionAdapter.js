// decisionAdapter.js
// Maps pack decisionTree + template definitions to wizard state effects given user answers.
// This stays deliberately lightweight; future evolution can handle richer effect merging.

export function applyDecisionsFromPack({ pack, answers }) {
  if (!pack) return null;
  const out = { scheduleMode: null, templateId: null, tmMethod: null, _notes: [] };

  // 1) Days per week -> schedule mode
  const days = Number(answers?.daysPerWeek ?? 4);
  out.scheduleMode = days === 4 ? '4day' : days === 3 ? '3day' : days === 2 ? '2day' : '1day';

  // 2) Assistance / template selection -> template id
  const a = String(answers?.assistanceChoice || '').toLowerCase();
  if (a.includes('bbb')) out.templateId = 'bbb60';
  else if (a.includes('triumv')) out.templateId = 'triumvirate';
  else if (a.includes('jack')) out.templateId = 'jack_shit';
  else if (a.includes('period') || a.includes('bible')) out.templateId = 'periodization_bible';
  else if (a.includes('bodyweight')) out.templateId = 'bodyweight';
  else out.templateId = pack?.templates?.[0]?.id || 'bbb60';

  // 3) TM method
  const tmm = String(answers?.tmMethod || '').toLowerCase();
  out.tmMethod = tmm.includes('estimate') ? 'estimate' : 'known_1rm';

  // Resolve template effects (supplemental / assistance definitions)
  const tpl = (pack.templates || []).find(t => t.id === out.templateId);
  if (!tpl) {
    out._notes.push('template not found');
    return out;
  }
  out.effects = tpl.effects || {};
  return out;
}

export default applyDecisionsFromPack;
