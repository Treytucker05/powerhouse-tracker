// Flattens schedulePreview into UI-friendly rows per week/session
export function toUiDays(schedulePreview) {
  if (!schedulePreview?.weeks?.length) return [];
  return schedulePreview.weeks.map((w) => {
    const rows = (w.days || []).map((d) => {
      const lifts = d.combineWith ? [d.lift, d.combineWith] : [d.lift];
      return { weekLabel: w.label, sessionWeekLabel: d.weekLabel, lifts };
    });
    return { label: w.label, sessions: rows };
  });
}
