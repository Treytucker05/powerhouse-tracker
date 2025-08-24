import React, { useEffect, useState } from 'react';
import { simpleDescribe } from '@/lib/templates/describe';

export default function TemplateDetail({ params }) {
  const id = params?.id;
  const [md, setMd] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}docs/templates/${id}.md`);
        if (!res.ok) throw new Error('not found');
        const text = await res.text();
        if (active) setMd(text);
      } catch {
        setErr('notfound');
        const fallback = simpleDescribe({
          id,
          display_name: id,
          days_per_week: { default: 4 },
          tm: { default_pct: 90 },
          scheme: { parsed: { variant: 'custom' } },
          assistance: { mode: 'template', targets: ['push','pull','single_leg','core'], volume: '50–100 reps/category' },
          rules: { pr_sets_allowed: true, jokers_allowed: false }
        });
        if (active) setMd(fallback);
      }
    })();
    return () => { active = false; };
  }, [id]);

  // Tiny Markdown renderer (very basic)
  const html = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br/>');

  return (
    <div className="p-4 text-gray-200">
      {err === 'notfound' && (
        <div className="mb-2 p-2 text-xs border border-yellow-600 bg-yellow-900/20 text-yellow-200 rounded">Playbook not found in docs; showing computed description.</div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
