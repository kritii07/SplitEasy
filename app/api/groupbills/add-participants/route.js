import { db } from "@/utils/dbConfig";
import { Participants } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { groupId, participants } = await req.json();

    if (!groupId || !participants || !participants.length) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await db.insert(Participants).values(
      participants.map((p) => ({ groupId, name: p.name, email: p.email || null }))
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error adding participants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
