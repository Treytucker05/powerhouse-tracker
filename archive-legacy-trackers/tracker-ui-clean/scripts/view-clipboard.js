import clipboardy from "clipboardy";

const data = clipboardy.readSync();
const preview = data.split(/\r?\n/).slice(0, 10).join("\n");
console.log("📋 Clipboard preview (first 10 lines):\n" + preview);
