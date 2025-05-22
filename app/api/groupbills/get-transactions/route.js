export const revalidate = 0; // ✅ Disable caching

import { db } from "@/utils/dbConfig";
import { Transactions, Participants } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = parseInt(searchParams.get("groupId"), 10); // ✅ Ensure it's an integer

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const transactions = await db
      .select({
        id: Transactions.id,
        amount: Transactions.amount,
        description: Transactions.description,
        createdAt: Transactions.createdAt,
        payerName: Participants.name
      })
      .from(Transactions)
      .leftJoin(Participants, eq(Transactions.payerId, Participants.id)) // ✅ Ensure all transactions are fetched
      .where(eq(Transactions.groupId, groupId))
      .orderBy(desc(Transactions.id)); // ✅ Show latest transactions first

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
