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

/** Pure transform — no state calls — so it's safe to call from an effect or a handler alike. */
function buildOrderedState(data: { projects: Project[]; order: ProjectOrder | null }) {
  const grouped: Record<ProjectCategory, string[]> = { web3: [], fullstack: [], ai: [] };
  for (const p of data.projects) grouped[p.category].push(p.name);

  let categoryOrder: ProjectCategory[] | null = null;
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
    if (data.order.categoryOrder?.length) categoryOrder = data.order.categoryOrder;
  }

  return { grouped, categoryOrder };
}

export default function AdjustProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [categoryOrder, setCategoryOrder] = useState<ProjectCategory[]>(CATEGORIES);
  const [namesByCategory, setNamesByCategory] = useState<Record<ProjectCategory, string[]>>({
    web3: [],
    fullstack: [],
    ai: [],
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    github: "",
    tech: "",
    category: "fullstack" as ProjectCategory,
    highlight: "",
  });
  const [addingProject, setAddingProject] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  async function refreshOrder() {
    const res = await fetch("/api/my-home/order");
    const data: { projects: Project[]; order: ProjectOrder | null } = await res.json();
    const { grouped, categoryOrder: nextCategoryOrder } = buildOrderedState(data);
    if (nextCategoryOrder) setCategoryOrder(nextCategoryOrder);
    setNamesByCategory(grouped);
  }

  useEffect(() => {
    fetch("/api/my-home/order")
      .then((res) => res.json())
      .then((data: { projects: Project[]; order: ProjectOrder | null }) => {
        const { grouped, categoryOrder: nextCategoryOrder } = buildOrderedState(data);
        if (nextCategoryOrder) setCategoryOrder(nextCategoryOrder);
        setNamesByCategory(grouped);
        setLoading(false);
      });
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage("");

    const res = await fetch("/api/my-home/sync", { method: "POST" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setSyncMessage(data.error ?? "Sync failed");
      setSyncing(false);
      return;
    }

    setSyncMessage(
      data.added > 0
        ? `Added ${data.added} new project${data.added === 1 ? "" : "s"} from GitHub (defaulted to Full Stack — recategorize below if needed).`
        : "No new repos found — everything's already synced."
    );

    if (data.added > 0) await refreshOrder();

    setSyncing(false);
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    setAddingProject(true);
    setAddMessage("");

    const res = await fetch("/api/my-home/add-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProject.name,
        description: newProject.description,
        github: newProject.github,
        tech: newProject.tech.split(",").map((t) => t.trim()).filter(Boolean),
        category: newProject.category,
        highlight: newProject.highlight,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setAddMessage(data.error ?? "Failed to add project");
      setAddingProject(false);
      return;
    }

    setAddMessage(`Added "${newProject.name}" to ${CATEGORY_LABELS[newProject.category]}.`);
    setNewProject({ name: "", description: "", github: "", tech: "", category: "fullstack", highlight: "" });
    await refreshOrder();
    setAddingProject(false);
  }

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">Adjust Projects</h1>
        <button
          onClick={handleLogout}
          className="text-xs text-white/40 hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 rounded-xl font-semibold text-sm glass border border-white/10 hover:border-violet-500/30 text-white/80 hover:text-white transition-all duration-200 disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "Sync from GitHub"}
        </button>
        {syncMessage && <p className="text-xs text-white/50">{syncMessage}</p>}
      </div>

      {/* Add project manually */}
      <section className="glass rounded-2xl p-5 border border-white/8 mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">Add a project</h2>
        <form onSubmit={handleAddProject} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Name</label>
              <input
                type="text"
                required
                value={newProject.name}
                onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">GitHub URL</label>
              <input
                type="text"
                required
                value={newProject.github}
                onChange={(e) => setNewProject((p) => ({ ...p, github: e.target.value }))}
                placeholder="https://github.com/Ragnar20-03/..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Description</label>
            <input
              type="text"
              value={newProject.description}
              onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Tech (comma-separated)</label>
              <input
                type="text"
                value={newProject.tech}
                onChange={(e) => setNewProject((p) => ({ ...p, tech: e.target.value }))}
                placeholder="TypeScript, React"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Category</label>
              <select
                value={newProject.category}
                onChange={(e) =>
                  setNewProject((p) => ({ ...p, category: e.target.value as ProjectCategory }))
                }
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-black">
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Highlight badge (optional)</label>
              <input
                type="text"
                value={newProject.highlight}
                onChange={(e) => setNewProject((p) => ({ ...p, highlight: e.target.value }))}
                placeholder="RAG"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={addingProject}
              className="px-5 py-2 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50"
            >
              {addingProject ? "Adding…" : "Add project"}
            </button>
            {addMessage && <p className="text-xs text-white/50">{addMessage}</p>}
          </div>
        </form>
      </section>

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
