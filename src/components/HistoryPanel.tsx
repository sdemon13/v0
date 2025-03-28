"use client";
import { useStore } from "@/lib/store";

export function HistoryPanel({ onSelect }: { onSelect: (code: string) => void }) {
  const { history } = useStore();

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-bold mb-2">История</h2>
      {history.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item)}
          className="text-left w-full text-sm border p-2 rounded hover:bg-gray-100"
        >
          {item.slice(0, 60)}...
        </button>
      ))}
    </div>
  );
}
