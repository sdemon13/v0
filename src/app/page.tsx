"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpenAI } from "openai";
import { useStore } from "@/lib/store";
import { HistoryPanel } from "@/components/HistoryPanel";
import Link from "next/link";

const presets = [
  "Create a glassy login form with avatar and animation",
  "Create a pricing card with 3 plans and CTA buttons",
  "Design a dashboard widget with stats and icons",
  "Build a hero section with image, title and CTA",
  "Create a minimalist navbar with dropdown"
];

// Инициализация OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY!,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const { addHistory, saveComponent } = useStore();

  const [code, setCode] = useState<string>(`export default function Component() {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold">Hello, world!</h1>
    </div>
  );
}`);
  const [prompt, setPrompt] = useState("Create a modern login form with Tailwind");
  const [loading, setLoading] = useState(false);

  async function generateCode() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a frontend expert. Return only valid React+Tailwind components.",
          },
          { role: "user", content: prompt },
        ],
      });

      const generated = res.choices[0]?.message?.content || "";
      setCode(generated);
      addHistory(generated);
    } catch (err) {
      console.error("Ошибка генерации:", err);
    } finally {
      setLoading(false);
    }
  }

  function exportCode() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Component.tsx";
    link.click();
  }

  function saveCurrentComponent() {
    const name = prompt("Введите имя компонента:");
    if (!name) return;
    saveComponent({
      name,
      code,
      date: new Date().toLocaleString("fr-FR"),
    });
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 min-h-screen bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white transition-colors">
      {/* Левая колонка: история */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4">
        <HistoryPanel onSelect={setCode} />
        <Link href="/my-components" className="block mt-4 text-sm underline text-blue-500">
          Мои компоненты →
        </Link>
      </div>

      {/* Центральная колонка: редактор и управление */}
      <div className="flex flex-col h-full col-span-1">
        <Editor
          height="75vh"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />

        {/* Пресеты */}
        <div className="flex flex-wrap gap-2 my-2">
          {presets.map((p, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(p)}
            >
              {p.slice(0, 40)}...
            </Button>
          ))}
        </div>

        {/* Поле ввода и кнопки */}
        <div className="space-y-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Что сгенерировать? Например: Create a dashboard card"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateCode} disabled={loading}>
              {loading ? "Генерируется..." : "Сгенерировать компонент"}
            </Button>
            <Button variant="secondary" onClick={exportCode}>
              Экспорт .tsx
            </Button>
            <Button variant="outline" onClick={saveCurrentComponent}>
              Сохранить как компонент
            </Button>
          </div>
        </div>
      </div>

      {/* Правая колонка: предпросмотр */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-xl">
        <iframe
          title="preview"
          sandbox="allow-scripts"
          className="w-full h-full border rounded-xl min-h-[90vh]"
          srcDoc={`<html><head><script src='https://cdn.tailwindcss.com'></script></head><body>${code}</body></html>`}
        />
      </div>
    </div>
  );
}
