"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MyComponentsPage() {
  const { saved, deleteComponent } = useStore();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (code: string, name: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Мои компоненты</h1>

      {saved.length === 0 && <p className="text-gray-500">Пока ничего не сохранено.</p>}

      {saved.map((comp, idx) => (
        <div key={idx} className="mb-6 p-4 rounded-xl border bg-white dark:bg-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{comp.name}</h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(comp.code, comp.name)}
              >
                {copied === comp.name ? "Скопировано!" : "Копировать"}
              </Button>
              <Button variant="destructive" onClick={() => deleteComponent(comp.name)}>
                Удалить
              </Button>
            </div>
          </div>
          <pre className="text-sm overflow-x-auto bg-neutral-100 dark:bg-neutral-900 p-4 rounded">
            {comp.code}
          </pre>
          <p className="text-xs text-gray-500 mt-1">Сохранено: {comp.date}</p>
        </div>
      ))}
    </div>
  );
}
