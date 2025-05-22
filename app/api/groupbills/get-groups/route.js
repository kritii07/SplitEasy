import { db } from "@/utils/dbConfig";
import { Groups, Participants } from "@/utils/schema";
import { eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get groups with participant counts
    const groupsWithCounts = await db.select({
      id: Groups.id,
      name: Groups.name,
      createdAt: Groups.createdAt,
      participantCount: count(Participants.id)
    })
    .from(Groups)
    .leftJoin(
      Participants,
      eq(Groups.id, Participants.groupId)
    )
    .groupBy(Groups.id)
    .orderBy(Groups.createdAt);

    return NextResponse.json(groupsWithCounts, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}