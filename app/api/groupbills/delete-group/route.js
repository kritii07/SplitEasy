import { db } from "@/utils/dbConfig";
import { Groups, Participants, Transactions, Splits } from "@/utils/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { groupId } = await req.json();
    const numericGroupId = Number(groupId);

    // Validate input
    if (!numericGroupId || isNaN(numericGroupId)) {
      return NextResponse.json(
        { error: "Invalid group ID" },
        { status: 400 }
      );
    }

    // Check group exists
    const [group] = await db.select()
      .from(Groups)
      .where(eq(Groups.id, numericGroupId))
      .limit(1);

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // 1. First get all transaction IDs for this group
    const groupTransactions = await db.select({ id: Transactions.id })
      .from(Transactions)
      .where(eq(Transactions.groupId, numericGroupId));

    const transactionIds = groupTransactions.map(t => t.id);

    // 2. Delete splits in batches (if transactions exist)
    if (transactionIds.length > 0) {
      await db.delete(Splits)
        .where(
          inArray(Splits.transactionId, transactionIds)
        );
    }

    // 3. Delete transactions
    await db.delete(Transactions)
      .where(eq(Transactions.groupId, numericGroupId));

    // 4. Delete participants
    await db.delete(Participants)
      .where(eq(Participants.groupId, numericGroupId));

    // 5. Finally delete the group
    await db.delete(Groups)
      .where(eq(Groups.id, numericGroupId));

    return NextResponse.json(
      { success: true },
      { status: 200 },
      {
        headers: {
          'Cache-Control': 'no-store',
          'CDN-Cache-Control': 'no-store',
          'Revalidate-Tag': 'groups'
        }
      }
    );

  } catch (error) {
    console.error("DELETE Group Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete group",
        details: error.message
      },
      { status: 500 }
    );
  }
}