import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "family.db");

function getDb(readonly = true) {
  return new Database(DB_PATH, { readonly });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "tree";
  const personId = searchParams.get("id");
  const search = searchParams.get("search");
  const all = searchParams.get("all");

  const db = getDb();

  // Return all persons for admin
  if (all === "true") {
    const people = db.prepare(`SELECT id, full_name FROM persons ORDER BY full_name`).all();
    return NextResponse.json({ people });
  }

  // Search by name
  if (search) {
    const results = db.prepare(`
      SELECT id, full_name, birth_year, death_year, gender, origin
      FROM persons
      WHERE full_name LIKE ?
      ORDER BY full_name
      LIMIT 20
    `).all(`%${search}%`);
    return NextResponse.json({ results });
  }

  // Get full tree or tree from a specific person's perspective
  const rootId = personId || getRootPerson(db);

  if (mode === "highlight") {
    // Return full tree with the selected person flagged
    const people = db.prepare(`SELECT * FROM persons`).all();
    const rels = db.prepare(`SELECT * FROM relationships`).all();
    return NextResponse.json({ people, relationships: rels, highlightId: rootId });
  }

  // Default: return tree rooted at the selected person
  const people = getRelatedPeople(db, rootId);
  const ids = people.map((p: any) => p.id);
  const rels = db.prepare(`
    SELECT * FROM relationships
    WHERE person_a_id IN (${ids.map(() => "?").join(",")})
    AND person_b_id IN (${ids.map(() => "?").join(",")})
  `).all(...ids, ...ids);

  return NextResponse.json({
    people,
    relationships: rels,
    rootId,
  });
}

function getRootPerson(db: any) {
  // Default root: Igara (oldest known ancestor)
  const igara = db.prepare(
    `SELECT id FROM persons WHERE full_name = 'Igara' LIMIT 1`
  ).get();
  if (igara) return igara.id;

  // Fallback: person with most children
  const row = db.prepare(`
    SELECT person_a_id as id, COUNT(*) as cnt
    FROM relationships
    WHERE type = 'parent_child'
    GROUP BY person_a_id
    ORDER BY cnt DESC
    LIMIT 1
  `).get();
  return row?.id;
}

function getRelatedPeople(db: any, rootId: string, maxDepth = 10) {
  // BFS outward from root person collecting all connected people
  const visited = new Set<string>();
  const queue = [rootId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const connected = db.prepare(`
      SELECT CASE
        WHEN person_a_id = ? THEN person_b_id
        ELSE person_a_id
      END as other_id
      FROM relationships
      WHERE person_a_id = ? OR person_b_id = ?
    `).all(current, current, current);

    for (const row of connected as any[]) {
      if (!visited.has(row.other_id)) {
        queue.push(row.other_id);
      }
    }
  }

  if (visited.size === 0) return [];

  const ids = Array.from(visited);
  return db.prepare(`
    SELECT * FROM persons
    WHERE id IN (${ids.map(() => "?").join(",")})
  `).all(...ids);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, birth_year, death_year, gender, origin, notes } = body;

    if (!full_name || !full_name.trim()) {
      return NextResponse.json({ error: "full_name is required" }, { status: 400 });
    }

    const db = getDb(false);
    const id = randomUUID();

    db.prepare(`
      INSERT INTO persons (id, full_name, birth_year, death_year, gender, origin, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      full_name.trim(),
      birth_year || null,
      death_year || null,
      gender || null,
      origin || null,
      notes || null
    );

    return NextResponse.json({ id, full_name: full_name.trim() }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb(false);

    // Remove all relationships involving this person first
    db.prepare(`DELETE FROM relationships WHERE person_a_id = ? OR person_b_id = ?`).run(id, id);

    // Remove the person
    const result = db.prepare(`DELETE FROM persons WHERE id = ?`).run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}