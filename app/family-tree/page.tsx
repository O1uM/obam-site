"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Person {
  id: string;
  full_name: string;
  birth_year: number | null;
  death_year: number | null;
  gender: string;
  origin: string;
  notes: string;
}

interface Relationship {
  id: string;
  person_a_id: string;
  person_b_id: string;
  type: string;
  is_biological: number;
}

interface TreeNode {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  gender: string;
  origin: string;
  children?: TreeNode[];
  _children?: TreeNode[];
  isRoot?: boolean;
  isHighlighted?: boolean;
}

export default function FamilyTree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [rootId, setRootId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [mode, setMode] = useState<"tree" | "highlight">("tree");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Load initial tree data
  useEffect(() => {
    fetchTree();
  }, [rootId, mode]);

  async function fetchTree() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mode });
      if (rootId) params.set("id", rootId);
      const res = await fetch(`/api/family?${params}`);
      const data = await res.json();
      setPeople(data.people || []);
      setRelationships(data.relationships || []);
      if (data.highlightId) setHighlightId(data.highlightId);
    } catch (e) {
      console.error("Failed to fetch family data", e);
    }
    setLoading(false);
  }

  // Search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/family?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build and render tree whenever data changes
  useEffect(() => {
    if (!people.length || !relationships.length) return;
    renderTree();
  }, [people, relationships, highlightId, mode]);

  function buildHierarchy(rootPersonId: string): TreeNode | null {
    const personMap = new Map(people.map((p) => [p.id, p]));

    // Build parent->children map from parent_child relationships
    const childrenMap = new Map<string, string[]>();
    for (const rel of relationships) {
      if (rel.type === "parent_child") {
        if (!childrenMap.has(rel.person_a_id)) {
          childrenMap.set(rel.person_a_id, []);
        }
        childrenMap.get(rel.person_a_id)!.push(rel.person_b_id);
      }
    }

    const visited = new Set<string>();

    function buildNode(personId: string, depth: number): TreeNode | null {
      if (visited.has(personId) || depth > 8) return null;
      visited.add(personId);

      const person = personMap.get(personId);
      if (!person) return null;

      const childIds = childrenMap.get(personId) || [];
      const childNodes = childIds
        .map((cid) => buildNode(cid, depth + 1))
        .filter(Boolean) as TreeNode[];

      return {
        id: person.id,
        name: person.full_name,
        birth_year: person.birth_year,
        death_year: person.death_year,
        gender: person.gender,
        origin: person.origin,
        isRoot: personId === rootPersonId,
        isHighlighted: personId === highlightId,
        children: childNodes.length > 0 ? childNodes : undefined,
      };
    }

    return buildNode(rootPersonId, 0);
  }

  function renderTree() {
    if (!svgRef.current || !people.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 1000;
    const height = svgRef.current.clientHeight || 700;

    // Find root — person with most children or selected root
    const rootPersonId =
      rootId ||
      (() => {
        const childCounts = new Map<string, number>();
        for (const rel of relationships) {
          if (rel.type === "parent_child") {
            childCounts.set(
              rel.person_a_id,
              (childCounts.get(rel.person_a_id) || 0) + 1
            );
          }
        }
        let best = people[0]?.id;
        let bestCount = 0;
        for (const [id, count] of childCounts) {
          if (count > bestCount) {
            bestCount = count;
            best = id;
          }
        }
        return best;
      })();

    const hierarchyData = buildHierarchy(rootPersonId);
    if (!hierarchyData) return;

    const root = d3.hierarchy(hierarchyData);

    // Collapse all nodes beyond depth 2 initially
    root.descendants().forEach((d: any) => {
      if (d.depth >= 2 && d.children) {
        d._children = d.children;
        d.children = null;
      }
    });

    const treeLayout = d3.tree<TreeNode>().nodeSize([200, 140]);

    // Zoom container
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // Center initially
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, 80).scale(0.75)
    );

    function update(source: any) {
      treeLayout(root as any);

      const nodes = root.descendants();
      const links = root.links();

      // Links
      const link = g
        .selectAll<SVGPathElement, any>(".link")
        .data(links, (d: any) => d.target.data.id);

      const linkEnter = link
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#d4d4d8")
        .attr("stroke-width", 1.5)
        .attr("d", () => {
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return d3
            .linkVertical<any, any>()
            .x((d) => d.x)
            .y((d) => d.y)({ source: o, target: o });
        });

      link
        .merge(linkEnter)
        .transition()
        .duration(400)
        .attr(
          "d",
          d3
            .linkVertical<any, any>()
            .x((d: any) => d.x)
            .y((d: any) => d.y)
        );

      link.exit().remove();

      // Nodes
      const node = g
        .selectAll<SVGGElement, any>(".node")
        .data(nodes, (d: any) => d.data.id);

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr(
          "transform",
          () => `translate(${source.x0 || 0}, ${source.y0 || 0})`
        )
        .style("cursor", "pointer")
        .on("click", (_: any, d: any) => {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        });

      // Card background
      nodeEnter
        .append("rect")
        .attr("x", -85)
        .attr("y", -32)
        .attr("width", 170)
        .attr("height", 64)
        .attr("rx", 10)
        .attr("fill", (d: any) => {
          if (d.data.isRoot) return "#18181b";
          if (d.data.isHighlighted) return "#7c3aed";
          if (mode === "highlight" && d.data.id === highlightId) return "#7c3aed";
          if (d.data.gender === "M") return "#1e3a5f";
          if (d.data.gender === "F") return "#3d1f3f";
          return "#27272a";
        })
        .attr("stroke", (d: any) => {
          if (d.data.isRoot || d.data.isHighlighted) return "#a78bfa";
          return "#3f3f46";
        })
        .attr("stroke-width", (d: any) =>
          d.data.isRoot || d.data.isHighlighted ? 2 : 1
        );

      // Name text (truncated)
      nodeEnter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .attr("fill", "#f4f4f5")
        .attr("font-family", "sans-serif")
        .each(function (d: any) {
          const parts = d.data.name.split(" ");
          const line1 = parts.slice(0, 2).join(" ");
          const line2 = parts.slice(2).join(" ");
          d3.select(this)
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "0")
            .text(line1.length > 18 ? line1.slice(0, 17) + "…" : line1);
          if (line2) {
            d3.select(this)
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "13px")
              .text(line2.length > 18 ? line2.slice(0, 17) + "…" : line2);
          }
        });

      // Birth/death year
      nodeEnter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .attr("font-size", "10px")
        .attr("fill", "#a1a1aa")
        .attr("font-family", "sans-serif")
        .text((d: any) => {
          if (d.data.birth_year && d.data.death_year)
            return `${d.data.birth_year} – ${d.data.death_year}`;
          if (d.data.birth_year) return `b. ${d.data.birth_year}`;
          return "";
        });

      // Expand/collapse indicator
      nodeEnter
        .filter((d: any) => d.children || d._children)
        .append("circle")
        .attr("cy", 38)
        .attr("r", 8)
        .attr("fill", "#3f3f46")
        .attr("stroke", "#71717a")
        .attr("stroke-width", 1);

      nodeEnter
        .filter((d: any) => d.children || d._children)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 42)
        .attr("font-size", "10px")
        .attr("fill", "#a1a1aa")
        .attr("font-family", "sans-serif")
        .text((d: any) => (d.children ? "−" : "+"));

      // Merge and transition
      const nodeMerge = node.merge(nodeEnter);

      nodeMerge
        .transition()
        .duration(400)
        .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);

      // Update +/- indicator after toggle
      nodeMerge.select("text:last-of-type").text((d: any) =>
        d.children ? "−" : "+"
      );

      node.exit().remove();

      // Store positions for transitions
      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);
  }

  function selectPerson(person: Person) {
    setSearch("");
    setSearchResults([]);
    setSelectedPerson(person);
    if (mode === "highlight") {
      setHighlightId(person.id);
    } else {
      setRootId(person.id);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
        <a
          href="/"
          className="font-semibold text-zinc-50 hover:underline text-sm"
        >
          ← obam.ai
        </a>
        <h1 className="text-lg font-bold text-zinc-50">Family Tree</h1>
        <span className="text-sm text-zinc-500">
          {people.length} people
        </span>
      </header>

      {/* Controls */}
      <div className="px-8 py-4 border-b border-zinc-800 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPerson(p)}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm text-zinc-100 border-b border-zinc-800 last:border-0"
                >
                  <div className="font-medium">{p.full_name}</div>
                  <div className="text-zinc-500 text-xs">
                    {p.birth_year ? `b. ${p.birth_year}` : ""}{" "}
                    {p.origin || ""}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg p-1">
          <button
            onClick={() => setMode("tree")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "tree"
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            Re-root
          </button>
          <button
            onClick={() => setMode("highlight")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === "highlight"
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            Highlight
          </button>
        </div>

        {/* Reset */}
        {rootId && (
          <button
            onClick={() => { setRootId(null); setHighlightId(null); }}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset view
          </button>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 ml-auto">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#1e3a5f] inline-block" /> Male
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#3d1f3f] inline-block" /> Female
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#18181b] inline-block" /> Root
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#7c3aed] inline-block" /> Selected
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-8 py-2 text-xs text-zinc-600 border-b border-zinc-800">
        Click any card to expand · Scroll to zoom · Drag to pan · Search a name to re-root or highlight
      </div>

      {/* Tree canvas */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
            Loading family tree…
          </div>
        )}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ minHeight: "70vh" }}
          className="bg-zinc-950"
        />
      </div>
    </div>
  );
}