CREATE TABLE "settlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupId" integer,
	"payerId" integer,
	"receiverId" integer,
	"amount" numeric NOT NULL,
	"settledAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_payerId_participants_id_fk" FOREIGN KEY ("payerId") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_receiverId_participants_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;