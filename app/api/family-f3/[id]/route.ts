import Database from "better-sqlite3";
import { NextResponse } from "next/server";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "family.db");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as {
    "first name"?: string;
    "last name"?: string;
    gender?: string;
    birthday?: string;
    "death date"?: string;
    origin?: string;
    clan?: string;
    notes?: string;
  };

  // Parse birthday (format: D/M/YYYY)
  const bParts = (body.birthday || "").split("/").map((s) => s.trim());
  const birth_day = bParts[0] || null;
  const birth_month = bParts[1] || null;
  const birth_year = bParts[2] || null;

  // Parse death date
  const dParts = (body["death date"] || "").split("/").map((s) => s.trim());
  const death_day = dParts[0] || null;
  const death_month = dParts[1] || null;
  const death_year = dParts[2] || null;

  const db = new Database(DB_PATH);

  try {
    db.prepare(
      `UPDATE persons SET
        first_name = ?,
        last_name = ?,
        gender = ?,
        birth_day = ?,
        birth_month = ?,
        birth_year = ?,
        death_day = ?,
        death_month = ?,
        death_year = ?,
        origin = ?,
        clan = ?,
        notes = ?
      WHERE id = ?`
    ).run(
      body["first name"] || null,
      body["last name"] || null,
      body.gender || "M",
      birth_day || null,
      birth_month || null,
      birth_year || null,
      death_day || null,
      death_month || null,
      death_year || null,
      body.origin || null,
      body.clan || null,
      body.notes || null,
      id
    );
  } finally {
    db.close();
  }

  return NextResponse.json({ success: true });
}
