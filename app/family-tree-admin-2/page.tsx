"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "family-chart/styles/family-chart.css"; // resolves to dist/styles/family-chart.css

const PASSWORD = "your-secret-here"; // change this

// ── Types ─────────────────────────────────────────────────────────────────────

interface PersonData {
  gender: "M" | "F";
  "first name": string;
  "last name": string;
  birthday?: string;
  "death date"?: string;
  origin?: string;
  clan?: string;
  notes?: string;
  avatar?: string;
}

interface Datum {
  id: string;
  data: PersonData;
  rels: { parents: string[]; children: string[]; spouses: string[] };
}

// ── Password gate ─────────────────────────────────────────────────────────────

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (input === PASSWORD) {
      onUnlock();
    } else {
      setError("That passphrase does not match our records.");
      setTimeout(() => setError(""), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0a0e] flex flex-col items-center justify-center px-4">
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-white mb-2">
        Mabogunje Family Tree
      </h1>
      <p className="text-sm text-white/40 font-[family-name:var(--font-dm-mono)] mb-8">
        Enter the passphrase to continue.
      </p>
      <div className="w-full max-w-sm">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Passphrase"
          className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-400/50 mb-3 text-sm"
        />
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button
          onClick={submit}
          className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f97316] to-[#ec4899] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  datum,
  allData,
  onNavigate,
  onClose,
}: {
  datum: Datum | null;
  allData: Datum[];
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  if (!datum) return null;

  const d = datum.data;
  const byId = (id: string) => allData.find((p) => p.id === id);

  const fullName = [d["first name"], d["last name"]].filter(Boolean).join(" ");

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-[#0d0a0e]/95 border-l border-white/10 backdrop-blur-md z-20 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-white">
          {fullName}
        </h2>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Details */}
      <div className="px-5 py-4 flex-1">
        <div className="space-y-3">
          {d.gender && (
            <Row label="Gender" value={d.gender === "M" ? "Male" : "Female"} />
          )}
          {d.birthday && <Row label="Born" value={d.birthday} />}
          {d["death date"] && <Row label="Died" value={d["death date"]} />}
          {d.origin && <Row label="Origin" value={d.origin} />}
          {d.clan && <Row label="Clan" value={d.clan} />}
          {d.notes && (
            <div>
              <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-white/30 mb-1">
                Notes
              </p>
              <p className="text-sm text-white/60 leading-relaxed">{d.notes}</p>
            </div>
          )}
        </div>

        {/* Relations */}
        {datum.rels.parents.length > 0 && (
          <RelSection
            title="Parents"
            ids={datum.rels.parents}
            byId={byId}
            onNavigate={onNavigate}
          />
        )}
        {datum.rels.spouses.length > 0 && (
          <RelSection
            title="Spouses"
            ids={datum.rels.spouses}
            byId={byId}
            onNavigate={onNavigate}
          />
        )}
        {datum.rels.children.length > 0 && (
          <RelSection
            title="Children"
            ids={datum.rels.children}
            byId={byId}
            onNavigate={onNavigate}
          />
        )}
      </div>

      {/* Make main button */}
      <div className="px-5 py-4 border-t border-white/10">
        <button
          onClick={() => onNavigate(datum.id)}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-[#f97316] to-[#ec4899] text-white text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          Set as main
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-white/30">
        {label}
      </p>
      <p className="text-sm text-white/75">{value}</p>
    </div>
  );
}

function RelSection({
  title,
  ids,
  byId,
  onNavigate,
}: {
  title: string;
  ids: string[];
  byId: (id: string) => Datum | undefined;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-xs font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-white/30 mb-2">
        {title}
      </p>
      <div className="space-y-1">
        {ids.map((id) => {
          const p = byId(id);
          if (!p) return null;
          const name = [p.data["first name"], p.data["last name"]]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Chart ─────────────────────────────────────────────────────────────────────

function FamilyChart() {
  const contRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [allData, setAllData] = useState<Datum[]>([]);
  const [selected, setSelected] = useState<Datum | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigate to a person (make them main and open panel)
  const navigateTo = useCallback(
    (id: string) => {
      const datum = allData.find((d) => d.id === id);
      if (!datum) return;
      setSelected(datum);
      chartRef.current?.updateMainId(id).updateTree({ tree_position: "main_to_middle" });
    },
    [allData]
  );

  // Search filter
  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const q = search.toLowerCase();
    setSearchResults(
      allData
        .filter((d) =>
          [d.data["first name"], d.data["last name"]]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
        .slice(0, 8)
    );
  }, [search, allData]);

  // Init chart once
  useEffect(() => {
    let destroyed = false;

    (async () => {
      const res = await fetch("/api/family-f3");
      const { data, mainId } = await res.json();

      if (destroyed || !contRef.current) return;

      setAllData(data);
      setLoading(false);

      const f3 = await import("family-chart");

      const chart = f3.createChart(contRef.current, data);
      chartRef.current = chart;

      // Custom HTML card
      chart
        .setCardHtml()
        .setCardDisplay([["first name", "last name"], ["birthday"]])
        .setStyle("rect")
        .setCardDim({ w: 180, h: 70, text_x: 12, text_y: 20, img_w: 0, img_h: 0 })
        .setOnCardClick((_e: MouseEvent, d: any) => {
          const datum = data.find((p: Datum) => p.id === d.data.id);
          setSelected(datum || null);
        })
        .setCardInnerHtmlCreator((d: any) => {
          const firstName = d.data.data["first name"] || "";
          const lastName = d.data.data["last name"] || "";
          const name = [firstName, lastName].filter(Boolean).join(" ");
          const birth = d.data.data.birthday ? `b. ${d.data.data.birthday}` : "";
          const gender = d.data.data.gender;
          const bgColor =
            gender === "M"
              ? "rgba(30,58,95,0.9)"
              : gender === "F"
              ? "rgba(61,31,63,0.9)"
              : "rgba(39,39,42,0.9)";
          const borderColor =
            gender === "M" ? "#3b82f6" : gender === "F" ? "#ec4899" : "#52525b";

          return `
            <div style="
              width:180px;height:70px;
              background:${bgColor};
              border:1.5px solid ${borderColor};
              border-radius:10px;
              display:flex;flex-direction:column;justify-content:center;
              padding:0 12px;
              box-sizing:border-box;
              cursor:pointer;
            ">
              <div style="font-family:var(--font-cormorant,serif);font-size:13px;font-weight:600;color:#f4f4f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
              ${birth ? `<div style="font-size:10px;color:#a1a1aa;margin-top:3px;">${birth}</div>` : ""}
            </div>
          `;
        });

      // Set main person and render
      chart
        .updateMainId(mainId)
        .setOrientationVertical()
        .setAncestryDepth(3)
        .setProgenyDepth(3)
        .updateTree({ initial: true, tree_position: "main_to_middle" });
    })();

    return () => { destroyed = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0a0e] flex flex-col font-[family-name:var(--font-cormorant)]">
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <a href="/" className="text-sm font-[family-name:var(--font-dm-mono)] tracking-widest uppercase text-white/40 hover:text-white transition-colors">
          ← obam.ai
        </a>
        <h1 className="text-lg font-semibold text-white">Mabogunje Family Tree</h1>
        <span className="text-sm text-white/30 font-[family-name:var(--font-dm-mono)]">
          {allData.length} people
        </span>
      </header>

      {/* Search bar */}
      <div className="px-8 py-3 border-b border-white/5 flex-shrink-0">
        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-400/50 font-[family-name:var(--font-dm-mono)]"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-[#0d0a0e] border border-white/10 rounded-lg shadow-xl z-30 overflow-hidden">
              {searchResults.map((p) => {
                const name = [p.data["first name"], p.data["last name"]]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={p.id}
                    onClick={() => { navigateTo(p.id); setSearch(""); setSearchResults([]); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                  >
                    <span className="font-medium">{name}</span>
                    {p.data.birthday && (
                      <span className="ml-2 text-xs text-white/30">b. {p.data.birthday}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tree canvas */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-[family-name:var(--font-dm-mono)]">
            Loading family tree…
          </div>
        )}

        {/* family-chart mounts here */}
        <div
          ref={contRef}
          id="FamilyChart"
          className="w-full h-full"
          style={{ minHeight: "calc(100vh - 120px)" }}
        />

        {/* Detail panel */}
        <DetailPanel
          datum={selected}
          allData={allData}
          onNavigate={(id) => { navigateTo(id); }}
          onClose={() => setSelected(null)}
        />
      </div>

      {/* Legend */}
      <div className="px-8 py-3 border-t border-white/5 flex items-center gap-6 text-xs font-[family-name:var(--font-dm-mono)] text-white/30 flex-shrink-0">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#1e3a5f] border border-[#3b82f6] inline-block" /> Male
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#3d1f3f] border border-[#ec4899] inline-block" /> Female
        </span>
        <span className="ml-auto">Click a card to view details · Scroll to zoom · Drag to pan</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FamilyTreeAdmin2() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;
  return <FamilyChart />;
}
