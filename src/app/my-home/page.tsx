"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CATEGORY_LABELS, type Project, type ProjectCategory } from "@/lib/projects-data";
import type { ProjectOrder } from "@/lib/project-order";

function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdjustProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [categoryOrder, setCategoryOrder] = useState<ProjectCategory[]>(CATEGORIES);
  const [namesByCategory, setNamesByCategory] = useState<Record<ProjectCategory, string[]>>({
    web3: [],
    fullstack: [],
    ai: [],
  });

  useEffect(() => {
    fetch("/api/my-home/order")
      .then((res) => res.json())
      .then((data: { projects: Project[]; order: ProjectOrder | null }) => {
        const grouped: Record<ProjectCategory, string[]> = { web3: [], fullstack: [], ai: [] };
        for (const p of data.projects) grouped[p.category].push(p.name);

        if (data.order) {
          const applyKnownFirst = (all: string[], saved: string[] | undefined) => {
            if (!saved || saved.length === 0) return all;
            const known = saved.filter((n) => all.includes(n));
            const missing = all.filter((n) => !known.includes(n));
            return [...known, ...missing];
          };
          grouped.ai = applyKnownFirst(grouped.ai, data.order.aiOrder);
          grouped.web3 = applyKnownFirst(grouped.web3, data.order.web3Order);
          grouped.fullstack = applyKnownFirst(grouped.fullstack, data.order.fullstackOrder);
          if (data.order.categoryOrder?.length) setCategoryOrder(data.order.categoryOrder);
        }

        setNamesByCategory(grouped);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const order: ProjectOrder = {
      categoryOrder,
      aiOrder: namesByCategory.ai,
      web3Order: namesByCategory.web3,
      fullstackOrder: namesByCategory.fullstack,
    };

    const res = await fetch("/api/my-home/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Failed to save");
      return;
    }

    setMessage("Saved — live site will pick up the new order.");
  }

  async function handleLogout() {
    await fetch("/api/my-home/logout", { method: "POST" });
    router.push("/my-home/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white/40 text-sm">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-white">Adjust Projects</h1>
        <button
          onClick={handleLogout}
          className="text-xs text-white/40 hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Category order */}
      <section className="glass rounded-2xl p-5 border border-white/8 mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">
          Category order (controls the &quot;All&quot; tab)
        </h2>
        <ul className="space-y-1.5">
          {categoryOrder.map((cat, i) => (
            <li
              key={cat}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/8"
            >
              <span className="text-sm text-white/80">{CATEGORY_LABELS[cat]}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCategoryOrder((c) => move(c, i, -1))}
                  disabled={i === 0}
                  className="px-2 py-1 rounded text-xs text-white/50 hover:text-white disabled:opacity-20"
                >
                  ↑
                </button>
                <button
                  onClick={() => setCategoryOrder((c) => move(c, i, 1))}
                  disabled={i === categoryOrder.length - 1}
                  className="px-2 py-1 rounded text-xs text-white/50 hover:text-white disabled:opacity-20"
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Per-category project order */}
      {categoryOrder.map((cat) => (
        <section key={cat} className="glass rounded-2xl p-5 border border-white/8 mb-6">
          <h2 className="text-sm font-semibold text-white mb-3">{CATEGORY_LABELS[cat]}</h2>
          <ul className="space-y-1.5">
            {namesByCategory[cat].map((name, i) => (
              <li
                key={name}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/8"
              >
                <span className="text-sm text-white/70">{name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setNamesByCategory((s) => ({ ...s, [cat]: move(s[cat], i, -1) }))
                    }
                    disabled={i === 0}
                    className="px-2 py-1 rounded text-xs text-white/50 hover:text-white disabled:opacity-20"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() =>
                      setNamesByCategory((s) => ({ ...s, [cat]: move(s[cat], i, 1) }))
                    }
                    disabled={i === namesByCategory[cat].length - 1}
                    className="px-2 py-1 rounded text-xs text-white/50 hover:text-white disabled:opacity-20"
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save order"}
        </button>
        {message && <p className="text-xs text-white/50">{message}</p>}
      </div>
    </main>
  );
}
