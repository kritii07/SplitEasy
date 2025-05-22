import { db } from "@/utils/dbConfig";
import { Splits, Participants, Transactions } from "@/utils/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    console.log("Fetching simplified splits for groupId:", groupId);

    // Fetch all splits (excluding self-transfers)
    const splits = await db.execute(sql`
      SELECT s."amount", s."payerId", s."receiverId"
      FROM "splits" s
      JOIN "participants" p1 ON s."payerId" = p1."id"
      JOIN "participants" p2 ON s."receiverId" = p2."id"
      WHERE p1."groupId" = ${groupId} AND p2."groupId" = ${groupId}
      AND s."payerId" != s."receiverId"
      AND s."isSettled" = false
    `);

    const participants = await db.execute(sql`
      SELECT "id", "name" FROM "participants"
      WHERE "groupId" = ${groupId}
    `);

    const participantMap = {};
    participants.rows.forEach(({ id, name }) => {
      participantMap[id] = name;
    });

    const netMap = {};

    // Track pairwise debts: payer → receiver
    for (const { payerId, receiverId, amount } of splits.rows) {
      const key = `${receiverId}->${payerId}`; // receiver owes payer

      if (!netMap[key]) {
        netMap[key] = 0;
      }

      netMap[key] += parseFloat(amount);
    }

    // Final results after mutual netting
    const finalSplits = [];

    const seenPairs = new Set();

    for (const key in netMap) {
      const [receiverId, payerId] = key.split("->");
      const reverseKey = `${payerId}->${receiverId}`;

      if (seenPairs.has(reverseKey)) continue; // already handled reverse

      const forwardAmount = netMap[key] || 0;
      const reverseAmount = netMap[reverseKey] || 0;

      const net = forwardAmount - reverseAmount;

      if (net > 0) {
        finalSplits.push({
          payer: participantMap[receiverId],
          receiver: participantMap[payerId],
          amount: net.toFixed(2),
        });
      } else if (net < 0) {
        finalSplits.push({
          payer: participantMap[payerId],
          receiver: participantMap[receiverId],
          amount: Math.abs(net).toFixed(2),
        });
      }

      seenPairs.add(key);
      seenPairs.add(reverseKey);
    }

    return NextResponse.json(finalSplits);
  } catch (error) {
    console.error("Error calculating simple splits:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
