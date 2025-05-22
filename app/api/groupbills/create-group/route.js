import { db } from "@/utils/dbConfig";
import { Groups } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, createdBy } = await req.json();

    if (!name || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db.insert(Groups).values({ name, createdBy }).returning({ id: Groups.id });

    return NextResponse.json({ success: true, groupId: result[0].id }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
