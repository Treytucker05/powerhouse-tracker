import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function renderMarkdown(md) {
    return md
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '<br/>');
}

export default function TemplateDetail() {
    const { id } = useParams();
    const [md, setMd] = useState('');
    const [missing, setMissing] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${import.meta.env.BASE_URL}docs/templates/${id}.md`);
                if (!res.ok) throw new Error('not found');
                setMd(await res.text());
            } catch (e) {
                setMissing(true);
            }
        })();
    }, [id]);
    return (
        <div className="p-4 text-gray-200">
            {missing && (
                <div className="mb-2 p-2 text-xs border border-yellow-600 bg-yellow-900/20 text-yellow-200 rounded">Playbook not found in docs (public/docs/templates). Run generator.</div>
            )}
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }} />
        </div>
    );
}
