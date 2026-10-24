import React from "react";
import { AlertCircle } from "lucide-react";

export default function AttentionCard({ title, value, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-qreva-ash border border-qreva-orange rounded-xl p-4 shadow-sm flex flex-col items-center justify-center ${onClick ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""}`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-qreva-ash mb-2 text-qreva-orange">
        <AlertCircle size={20} />
      </div>
      <h4 className="text-qreva-orange text-xs font-medium mb-1 text-center">{title}</h4>
      <p className="text-xl font-bold text-qreva-orange">{value}</p>
    </div>
  );
}