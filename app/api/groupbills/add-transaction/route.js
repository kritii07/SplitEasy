import { db } from "@/utils/dbConfig";
import { Transactions, Splits, Participants } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { groupId, payerId, amount, description, splitType, selectedParticipants } = await req.json();
    
    console.log("Received data:", { groupId, payerId, amount, description, splitType, selectedParticipants });

    // Validate input
    if (!groupId || !payerId || !amount) {
      console.error("Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert transaction
    const transaction = await db.insert(Transactions).values({
      groupId,
      payerId,
      amount: parseFloat(amount), // Ensure numeric value
      description,
    }).returning({ id: Transactions.id });

    const transactionId = transaction[0]?.id;
    console.log("Transaction inserted with ID:", transactionId);

    if (!transactionId) {
      throw new Error("Failed to insert transaction");
    }

    // Fetch all participants in the group
    const participants = await db.select().from(Participants).where(eq(Participants.groupId, groupId));
    console.log("Participants in group:", participants);

    if (!participants.length) {
      throw new Error("No participants found for this group");
    }

    let splits = [];

    if (splitType === "equal") {
      // Equal split among all participants (except payer)
      let splitAmount = parseFloat((amount / participants.length).toFixed(2)); // Ensure numeric value
      participants.forEach((participant) => {
        if (participant.id !== payerId) {
          splits.push({
            transactionId,
            payerId,
            receiverId: participant.id,
            amount: splitAmount,
          });
        }
      });
    } else if (splitType === "custom") {
      // Custom split among selected participants
      if (!selectedParticipants || !selectedParticipants.length) {
        throw new Error("No participants selected for custom split");
      }
      let splitAmount = parseFloat((amount / selectedParticipants.length).toFixed(2)); // Ensure numeric value
      selectedParticipants.forEach((participantId) => {
        if (participantId !== payerId) {
          splits.push({
            transactionId,
            payerId,
            receiverId: participantId,
            amount: splitAmount,
          });
        }
      });
    }

    console.log("Splits to be inserted:", splits);

    // Insert each split separately (Fix for Drizzle ORM)
    for (const split of splits) {
      await db.insert(Splits).values(split);
    }

    // After inserting splits:
    const verifySplits = await db.select().from(Splits).where(
      eq(Splits.transactionId, transactionId)
    );
    console.log("VERIFY INSERTED SPLITS:", verifySplits);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error in add-transaction API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
