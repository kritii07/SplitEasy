ALTER TABLE "splits" ADD COLUMN "settled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "splits" ADD COLUMN "settledAt" timestamp;