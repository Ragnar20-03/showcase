"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CATEGORIES, CATEGORY_LABELS, type Project, type ProjectCategory } from "@/lib/projects-data";
import type { ProjectOrder } from "@/lib/project-order";
import type { ProjectOverrideFields } from "@/lib/project-overrides";
import type { HeroStatDoc } from "@/lib/hero-stats-store";

type OrderResponse = {
  projects: Project[];
  order: ProjectOrder | null;
  overrides: Record<string, ProjectOverrideFields>;
};

type EditForm = {
  description: string;
  fullDescription: string;
  tech: string;
  category: ProjectCategory;
  github: string;
  highlight: string;
};

/** Pure transform — no state calls — so it's safe to call from an effect or a handler alike. */
function buildOrderedState(data: OrderResponse) {
  const grouped: Record<ProjectCategory, string[]> = { web3: [], fullstack: [], ai: [] };
  const projectsByName: Record<string, Project> = {};
  for (const p of data.projects) {
    grouped[p.category].push(p.name);
    projectsByName[p.name] = p;
  }

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

  // Hidden projects sort to the bottom of their category — stable sort keeps
  // everything else in its existing relative order.
  const sortHiddenLast = (names: string[]) =>
    [...names].sort((a, b) => {
      const aHidden = data.overrides[a]?.hidden ? 1 : 0;
      const bHidden = data.overrides[b]?.hidden ? 1 : 0;
      return aHidden - bHidden;
    });
  grouped.ai = sortHiddenLast(grouped.ai);
  grouped.web3 = sortHiddenLast(grouped.web3);
  grouped.fullstack = sortHiddenLast(grouped.fullstack);

  return { grouped, categoryOrder, projectsByName, overrides: data.overrides };
}

function SortableRow({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: (drag: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
  }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className={className}>
      {children({ attributes, listeners })}
    </li>
  );
}

function effectiveProject(name: string, base: Project | undefined, override: ProjectOverrideFields | undefined): EditForm {
  return {
    description: override?.description ?? base?.description ?? "",
    fullDescription: override?.fullDescription ?? base?.fullDescription ?? "",
    tech: (override?.tech ?? base?.tech ?? []).join(", "),
    category: override?.category ?? base?.category ?? "fullstack",
    github: override?.github ?? base?.github ?? "",
    highlight: override?.highlight ?? base?.highlight ?? "",
  };
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
  const [projectsByName, setProjectsByName] = useState<Record<string, Project>>({});
  const [overrides, setOverrides] = useState<Record<string, ProjectOverrideFields>>({});
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [rowMessage, setRowMessage] = useState<{ name: string; text: string } | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    fullDescription: "",
    github: "",
    tech: "",
    category: "fullstack" as ProjectCategory,
    highlight: "",
  });
  const [addingProject, setAddingProject] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const [heroStats, setHeroStats] = useState<HeroStatDoc[]>([]);
  const [newHeroStat, setNewHeroStat] = useState({ value: "", label: "" });
  const [addingHeroStat, setAddingHeroStat] = useState(false);
  const [heroStatMessage, setHeroStatMessage] = useState("");
  const [editingHeroStatId, setEditingHeroStatId] = useState<string | null>(null);
  const [editHeroStatForm, setEditHeroStatForm] = useState({ value: "", label: "" });
  const [savingHeroStat, setSavingHeroStat] = useState(false);

  async function refreshHeroStats() {
    const res = await fetch("/api/my-home/hero-stats");
    const data: { stats: HeroStatDoc[] } = await res.json();
    setHeroStats(data.stats);
  }

  async function handleAddHeroStat(e: React.FormEvent) {
    e.preventDefault();
    setAddingHeroStat(true);
    setHeroStatMessage("");

    const res = await fetch("/api/my-home/hero-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHeroStat),
    });
    const data = await res.json().catch(() => ({}));

    setAddingHeroStat(false);

    if (!res.ok) {
      setHeroStatMessage(data.error ?? "Failed to add stat");
      return;
    }

    setNewHeroStat({ value: "", label: "" });
    await refreshHeroStats();
  }

  function handleStartEditHeroStat(stat: HeroStatDoc) {
    setEditingHeroStatId(stat.id);
    setEditHeroStatForm({ value: stat.value, label: stat.label });
    setHeroStatMessage("");
  }

  async function handleSaveEditHeroStat(id: string) {
    setSavingHeroStat(true);

    const res = await fetch(`/api/my-home/hero-stats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editHeroStatForm),
    });
    const data = await res.json().catch(() => ({}));

    setSavingHeroStat(false);

    if (!res.ok) {
      setHeroStatMessage(data.error ?? "Failed to save");
      return;
    }

    setEditingHeroStatId(null);
    await refreshHeroStats();
  }

  async function handleDeleteHeroStat(id: string) {
    const res = await fetch(`/api/my-home/hero-stats/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setHeroStatMessage(data.error ?? "Failed to delete");
      return;
    }

    await refreshHeroStats();
  }

  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCategoryOrder((c) => {
      const oldIndex = c.indexOf(active.id as ProjectCategory);
      const newIndex = c.indexOf(over.id as ProjectCategory);
      return arrayMove(c, oldIndex, newIndex);
    });
  }

  function handleProjectDragEnd(cat: ProjectCategory, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setNamesByCategory((s) => {
      const list = s[cat];
      const oldIndex = list.indexOf(active.id as string);
      const newIndex = list.indexOf(over.id as string);
      return { ...s, [cat]: arrayMove(list, oldIndex, newIndex) };
    });
  }

  async function refreshOrder() {
    const res = await fetch("/api/my-home/order");
    const data: OrderResponse = await res.json();
    const { grouped, categoryOrder: nextCategoryOrder, projectsByName: nextProjects, overrides: nextOverrides } =
      buildOrderedState(data);
    if (nextCategoryOrder) setCategoryOrder(nextCategoryOrder);
    setNamesByCategory(grouped);
    setProjectsByName(nextProjects);
    setOverrides(nextOverrides);
  }

  useEffect(() => {
    fetch("/api/my-home/order")
      .then((res) => res.json())
      .then((data: OrderResponse) => {
        const { grouped, categoryOrder: nextCategoryOrder, projectsByName: nextProjects, overrides: nextOverrides } =
          buildOrderedState(data);
        if (nextCategoryOrder) setCategoryOrder(nextCategoryOrder);
        setNamesByCategory(grouped);
        setProjectsByName(nextProjects);
        setOverrides(nextOverrides);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/my-home/hero-stats")
      .then((res) => res.json())
      .then((data: { stats: HeroStatDoc[] }) => {
        setHeroStats(data.stats);
      });
  }, []);

  function handleStartEdit(name: string) {
    setEditingProject(name);
    setEditForm(effectiveProject(name, projectsByName[name], overrides[name]));
    setRowMessage(null);
  }

  async function handleSaveEdit(name: string) {
    if (!editForm) return;
    setSavingEdit(true);

    const res = await fetch("/api/my-home/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectKey: name,
        description: editForm.description,
        fullDescription: editForm.fullDescription,
        tech: editForm.tech.split(",").map((t) => t.trim()).filter(Boolean),
        category: editForm.category,
        github: editForm.github,
        highlight: editForm.highlight,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSavingEdit(false);

    if (!res.ok) {
      setRowMessage({ name, text: data.error ?? "Failed to save" });
      return;
    }

    setEditingProject(null);
    setEditForm(null);
    setRowMessage({ name, text: "Saved." });
    await refreshOrder();
  }

  async function handleToggleHide(name: string) {
    const isHidden = overrides[name]?.hidden === true;

    const res = await fetch("/api/my-home/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectKey: name, hidden: !isHidden }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setRowMessage({ name, text: data.error ?? "Failed to update" });
      return;
    }

    await refreshOrder();
  }

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
        fullDescription: newProject.fullDescription,
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
    setNewProject({
      name: "",
      description: "",
      fullDescription: "",
      github: "",
      tech: "",
      category: "fullstack",
      highlight: "",
    });
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

      {/* Hero stats */}
      <section className="glass rounded-2xl p-5 border border-white/8 mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">Hero stats (top of homepage)</h2>

        <ul className="space-y-1.5 mb-4">
          {heroStats.map((stat) => {
            const isEditing = editingHeroStatId === stat.id;
            return (
              <li
                key={stat.id}
                className="rounded-lg bg-white/5 border border-white/8"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-white/70">
                    <span className="font-bold text-white">{stat.value}</span>{" "}
                    <span className="text-white/40">— {stat.label}</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setEditingHeroStatId(null);
                        } else {
                          handleStartEditHeroStat(stat);
                        }
                      }}
                      className="px-2 py-1 rounded text-xs text-white/50 hover:text-white"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteHeroStat(stat.id)}
                      className="px-2 py-1 rounded text-xs text-white/50 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="px-3 pb-3 pt-1 flex flex-wrap items-end gap-2 border-t border-white/8">
                    <div>
                      <label className="block text-[10px] text-white/40 mb-1">Value</label>
                      <input
                        type="text"
                        value={editHeroStatForm.value}
                        onChange={(e) =>
                          setEditHeroStatForm((f) => ({ ...f, value: e.target.value }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 mb-1">Label</label>
                      <input
                        type="text"
                        value={editHeroStatForm.label}
                        onChange={(e) =>
                          setEditHeroStatForm((f) => ({ ...f, label: e.target.value }))
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveEditHeroStat(stat.id)}
                      disabled={savingHeroStat}
                      className="px-4 py-1.5 rounded-lg font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50"
                    >
                      {savingHeroStat ? "Saving…" : "Save"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <form onSubmit={handleAddHeroStat} className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs text-white/40 mb-1">Value</label>
            <input
              type="text"
              required
              value={newHeroStat.value}
              onChange={(e) => setNewHeroStat((s) => ({ ...s, value: e.target.value }))}
              placeholder="15+"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Label</label>
            <input
              type="text"
              required
              value={newHeroStat.label}
              onChange={(e) => setNewHeroStat((s) => ({ ...s, label: e.target.value }))}
              placeholder="AI Projects"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={addingHeroStat}
            className="px-5 py-2 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50"
          >
            {addingHeroStat ? "Adding…" : "Add stat"}
          </button>
          {heroStatMessage && <p className="text-xs text-white/50">{heroStatMessage}</p>}
        </form>
      </section>

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
            <label className="block text-xs text-white/40 mb-1">Short description (shown on the card)</label>
            <input
              type="text"
              value={newProject.description}
              onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">
              Full description (shown in the popup — optional, falls back to short description)
            </label>
            <textarea
              rows={3}
              value={newProject.fullDescription}
              onChange={(e) => setNewProject((p) => ({ ...p, fullDescription: e.target.value }))}
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
        <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
          <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
            <ul className="space-y-1.5">
              {categoryOrder.map((cat) => (
                <SortableRow
                  key={cat}
                  id={cat}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/8"
                >
                  {({ attributes, listeners }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <span
                          {...attributes}
                          {...listeners}
                          className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 select-none touch-none"
                          aria-label="Drag to reorder"
                        >
                          ⠿
                        </span>
                        <span className="text-sm text-white/80">{CATEGORY_LABELS[cat]}</span>
                      </div>
                    </>
                  )}
                </SortableRow>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </section>

      {/* Per-category project order */}
      {categoryOrder.map((cat) => (
        <section key={cat} className="glass rounded-2xl p-5 border border-white/8 mb-6">
          <h2 className="text-sm font-semibold text-white mb-3">{CATEGORY_LABELS[cat]}</h2>
          <DndContext
            sensors={dndSensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleProjectDragEnd(cat, e)}
          >
            <SortableContext items={namesByCategory[cat]} strategy={verticalListSortingStrategy}>
              <ul className="space-y-1.5">
                {namesByCategory[cat].map((name) => {
                  const isHidden = overrides[name]?.hidden === true;
                  const isEditing = editingProject === name;

                  return (
                    <SortableRow
                      key={name}
                      id={name}
                      className={`rounded-lg bg-white/5 border border-white/8 ${isHidden ? "opacity-40" : ""}`}
                    >
                      {({ attributes, listeners }) => (
                        <>
                          <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 select-none touch-none shrink-0"
                                aria-label="Drag to reorder"
                              >
                                ⠿
                              </span>
                              <span className="text-sm text-white/70 truncate">
                                {name}
                                {isHidden && <span className="ml-2 text-[10px] text-white/30">(hidden)</span>}
                              </span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  if (isEditing) {
                                    setEditingProject(null);
                                    setEditForm(null);
                                  } else {
                                    handleStartEdit(name);
                                  }
                                }}
                                className="px-2 py-1 rounded text-xs text-white/50 hover:text-white"
                              >
                                {isEditing ? "Cancel" : "Edit"}
                              </button>
                              <button
                                onClick={() => handleToggleHide(name)}
                                className="px-2 py-1 rounded text-xs text-white/50 hover:text-white"
                              >
                                {isHidden ? "Show" : "Hide"}
                              </button>
                            </div>
                          </div>

                          {isEditing && editForm && (
                    <div className="px-3 pb-3 pt-1 space-y-2 border-t border-white/8">
                      <div>
                        <label className="block text-[10px] text-white/40 mb-1">Short description</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => (f ? { ...f, description: e.target.value } : f))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-1">Full description</label>
                        <textarea
                          rows={3}
                          value={editForm.fullDescription}
                          onChange={(e) =>
                            setEditForm((f) => (f ? { ...f, fullDescription: e.target.value } : f))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-white/40 mb-1">Tech (comma-separated)</label>
                          <input
                            type="text"
                            value={editForm.tech}
                            onChange={(e) =>
                              setEditForm((f) => (f ? { ...f, tech: e.target.value } : f))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/40 mb-1">Category</label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm((f) =>
                                f ? { ...f, category: e.target.value as ProjectCategory } : f
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c} className="bg-black">
                                {CATEGORY_LABELS[c]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/40 mb-1">Highlight badge</label>
                          <input
                            type="text"
                            value={editForm.highlight}
                            onChange={(e) =>
                              setEditForm((f) => (f ? { ...f, highlight: e.target.value } : f))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={editForm.github}
                          onChange={(e) =>
                            setEditForm((f) => (f ? { ...f, github: e.target.value } : f))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => handleSaveEdit(name)}
                          disabled={savingEdit}
                          className="px-4 py-1.5 rounded-lg font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50"
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                        {rowMessage?.name === name && (
                          <p className="text-[10px] text-white/50">{rowMessage.text}</p>
                        )}
                      </div>
                            </div>
                          )}
                        </>
                      )}
                    </SortableRow>
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>
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
