import { useEffect } from "react";

export default function Drawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex">
      <div className="ml-auto w-full max-w-md bg-white p-4 shadow-lg overflow-y-auto">
        <button className="mb-4 text-sm text-gray-500" onClick={onClose}>Close ✕</button>
        {children}
      </div>
    </div>
  );
}
