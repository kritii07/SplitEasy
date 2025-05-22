import { db } from "@/utils/dbConfig";
import { Groups } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; 
import { auth } from "@clerk/nextjs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("id");

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  try {
    // Corrected Query
    const group = await db.select().from(Groups).where(eq(Groups.id, Number(groupId)));

    if (group.length === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group[0]); // Return single group object
  } catch (error) {
    console.error("Error fetching group details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
