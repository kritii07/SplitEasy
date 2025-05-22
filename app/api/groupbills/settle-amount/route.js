import { db } from "@/utils/dbConfig";
import { Splits, Settlements, Participants } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { groupId, payerId, receiverId, amount } = await req.json();

    // Validate participant IDs
    const [payer] = await db.select()
      .from(Participants)
      .where(
        and(
          eq(Participants.id, payerId),
          eq(Participants.groupId, groupId)
        )
      );

    const [receiver] = await db.select()
      .from(Participants)
      .where(
        and(
          eq(Participants.id, receiverId),
          eq(Participants.groupId, groupId)
        )
      );

    if (!payer || !receiver) {
      return NextResponse.json(
        { error: "Invalid participant IDs" },
        { status: 400 }
      );
    }

    // Record the settlement
    const [settlement] = await db.insert(Settlements)
      .values({
        groupId,
        payerId,
        receiverId,
        amount
      })
      .returning();

    // Mark the original splits as settled
    await db.update(Splits)
      .set({ isSettled: true })
      .where(
        and(
          eq(Splits.payerId, payerId),
          eq(Splits.receiverId, receiverId),
          eq(Splits.groupId, groupId),
          eq(Splits.isSettled, false)
        )
      );

    return NextResponse.json({ 
      success: true,
      settlement: {
        ...settlement,
        payerName: payer.name,
        receiverName: receiver.name
      } 
    });
  } catch (error) {
    console.error("Settlement error:", error);
    return NextResponse.json(
      { error: "Failed to record settlement" },
      { status: 500 }
    );
    }
}