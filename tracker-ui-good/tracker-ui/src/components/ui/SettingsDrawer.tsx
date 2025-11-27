import React, { useState } from "react";
import { useSettings } from "../../store/settingsStore";

export default function SettingsDrawer() {
    const { bookMode, setBookMode } = useSettings();
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button aria-label="Open settings" className="btn btn-sm" onClick={() => setOpen(true)}>Settings</button>
            {open && (
                <div className="drawer-backdrop" onClick={() => setOpen(false)} />
            )}
            {open && (
                <div className="drawer-panel">
                    <div className="drawer-header">
                        <h3>Settings</h3>
                        <button className="icon" onClick={() => setOpen(false)}>✕</button>
                    </div>
                    <div className="drawer-content">
                        <div className="field">
                            <label>Book Mode</label>
                            <select value={bookMode} onChange={e => setBookMode(e.target.value as any)}>
                                <option value="recommend">Recommend (warn only)</option>
                                <option value="enforce">Enforce (block on violations)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        .drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.3);}
        .drawer-panel{position:fixed;top:0;right:0;height:100vh;width:320px;background:#fff;box-shadow:-2px 0 8px rgba(0,0,0,.2);display:flex;flex-direction:column;}
        .drawer-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;}
        .drawer-content{padding:12px 16px;}
        .field{display:flex;flex-direction:column;gap:6px;margin:12px 0;}
        .btn{background:#111;color:#fff;border:none;border-radius:6px;padding:6px 10px;}
        .btn.btn-sm{font-size:12px;padding:4px 8px;border-radius:4px;}
      `}</style>
        </div>
    );
}
