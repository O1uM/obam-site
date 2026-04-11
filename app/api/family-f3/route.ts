import Database from "better-sqlite3";
import { NextResponse } from "next/server";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "family.db");

function getDb() {
  return new Database(DB_PATH, { readonly: true });
}

export async function GET() {
  const db = getDb();

  const people = db.prepare(`SELECT * FROM persons`).all() as any[];
  const relationships = db.prepare(`SELECT * FROM relationships`).all() as any[];

  // Build lookup maps
  const parents = new Map<string, string[]>();   // child_id -> [parent_id, ...]
  const children = new Map<string, string[]>();  // parent_id -> [child_id, ...]
  const spouses = new Map<string, string[]>();   // person_id -> [spouse_id, ...]

  for (const rel of relationships) {
    if (rel.type === "parent_child") {
      // person_a is parent, person_b is child
      if (!children.has(rel.person_a_id)) children.set(rel.person_a_id, []);
      children.get(rel.person_a_id)!.push(rel.person_b_id);

      if (!parents.has(rel.person_b_id)) parents.set(rel.person_b_id, []);
      parents.get(rel.person_b_id)!.push(rel.person_a_id);
    } else if (rel.type === "spouse") {
      if (!spouses.has(rel.person_a_id)) spouses.set(rel.person_a_id, []);
      spouses.get(rel.person_a_id)!.push(rel.person_b_id);

      if (!spouses.has(rel.person_b_id)) spouses.set(rel.person_b_id, []);
      spouses.get(rel.person_b_id)!.push(rel.person_a_id);
    }
  }

  const data = people.map((p) => {
    const birthParts = [p.birth_day, p.birth_month, p.birth_year]
      .filter(Boolean)
      .join("/");
    const deathParts = [p.death_day, p.death_month, p.death_year]
      .filter(Boolean)
      .join("/");

    return {
      id: p.id,
      data: {
        gender: p.gender === "M" ? "M" : p.gender === "F" ? "F" : "M",
        "first name": p.first_name || p.full_name,
        "last name": p.last_name || "",
        birthday: birthParts || undefined,
        "death date": deathParts || undefined,
        origin: p.origin || undefined,
        clan: p.clan || undefined,
        notes: p.notes || undefined,
        avatar: p.avatar || undefined,
      },
      rels: {
        parents: parents.get(p.id) || [],
        children: children.get(p.id) || [],
        spouses: spouses.get(p.id) || [],
      },
    };
  });

  // Find Igara as the default main person
  const igara = people.find((p) => p.full_name === "Igara");
  const mainId = igara?.id || people[0]?.id;

  return NextResponse.json({ data, mainId });
}
