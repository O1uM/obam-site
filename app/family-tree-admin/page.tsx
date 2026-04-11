"use client";

import { useEffect, useState } from "react";

interface Person {
  id: string;
  full_name: string;
}

interface FormState {
  full_name: string;
  birth_year: string;
  death_year: string;
  gender: string;
  origin: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  full_name: "",
  birth_year: "",
  death_year: "",
  gender: "",
  origin: "",
  notes: "",
};

export default function FamilyTreeAdmin() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    setLoading(true);
    try {
      const res = await fetch("/api/family?all=true");
      const data = await res.json();
      setPeople(data.people || []);
    } catch {
      setError("Failed to load family members.");
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          birth_year: form.birth_year ? parseInt(form.birth_year) : null,
          death_year: form.death_year ? parseInt(form.death_year) : null,
          gender: form.gender || null,
          origin: form.origin || null,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add member.");
      }
      setForm(EMPTY_FORM);
      setSuccess(`${form.full_name} added successfully.`);
      await fetchPeople();
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  async function handleRemove(person: Person) {
    if (!confirm(`Remove "${person.full_name}" and all their relationships?`)) return;
    setRemovingId(person.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/family?id=${encodeURIComponent(person.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member.");
      }
      setSuccess(`${person.full_name} removed.`);
      await fetchPeople();
    } catch (err: any) {
      setError(err.message);
    }
    setRemovingId(null);
  }

  const filtered = people.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
        <a href="/family-tree" className="font-semibold text-zinc-50 hover:underline text-sm">
          ← Family Tree
        </a>
        <h1 className="text-lg font-bold text-zinc-50">Family Tree Admin</h1>
        <span className="text-sm text-zinc-500">{people.length} members</span>
      </header>

      <div className="flex-1 px-8 py-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">

        {/* Feedback */}
        {error && (
          <div className="bg-red-950 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-lg px-4 py-3 text-sm">
            {success}
          </div>
        )}

        {/* Add Member Form */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
            Add Member
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Akin Mabogunje"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Nigeria"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Birth Year</label>
                <input
                  type="number"
                  placeholder="e.g. 1945"
                  value={form.birth_year}
                  onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Death Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2010"
                  value={form.death_year}
                  onChange={(e) => setForm({ ...form, death_year: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="">— select —</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !form.full_name.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {submitting ? "Adding…" : "Add Member"}
              </button>
            </div>
          </form>
        </section>

        {/* Members Table */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Members
            </h2>
            <input
              type="text"
              placeholder="Filter by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 w-48"
            />
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-zinc-500 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-zinc-500 text-sm">
              {search ? "No members match your filter." : "No members yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/2">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 w-20" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((person, i) => (
                    <tr
                      key={person.id}
                      className={`border-b border-zinc-800 last:border-0 ${
                        i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/50"
                      } hover:bg-zinc-800 transition-colors`}
                    >
                      <td className="px-6 py-3 text-zinc-100 font-medium">
                        {person.full_name}
                      </td>
                      <td className="px-6 py-3 text-zinc-500 font-mono text-xs">
                        {person.id}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleRemove(person)}
                          disabled={removingId === person.id}
                          className="text-xs text-red-400 hover:text-red-300 disabled:text-zinc-600 transition-colors px-2 py-1 rounded border border-transparent hover:border-red-800"
                        >
                          {removingId === person.id ? "Removing…" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
