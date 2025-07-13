import { User } from "lucide-react";

export function Avatar({ className = "", ...props }) {
  return (
    <div 
      className={`w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center ${className}`}
      {...props}
    >
      <User className="w-4 h-4 text-gray-300" />
    </div>
  );
}
