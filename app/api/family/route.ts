import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "family.db");

function getDb() {
  return new Database(DB_PATH, { readonly: true });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "tree";
  const personId = searchParams.get("id");
  const search = searchParams.get("search");

  const db = getDb();

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