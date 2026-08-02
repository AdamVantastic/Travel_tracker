CREATE TYPE "country_status" AS ENUM('visited', 'lived', 'want');
CREATE TYPE "favorite_type" AS ENUM('restaurant', 'hotel', 'attraction', 'neighborhood');

CREATE TABLE IF NOT EXISTS "countries" (
  "code" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "continent" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_countries" (
  "user_id" text NOT NULL,
  "country_code" text NOT NULL,
  "status" "country_status" NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_countries_user_id_country_code_pk" PRIMARY KEY("user_id","country_code")
);

CREATE TABLE IF NOT EXISTS "favorites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "type" "favorite_type" NOT NULL,
  "name" text NOT NULL,
  "country_code" text NOT NULL,
  "city" text,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "user_countries" ADD CONSTRAINT "user_countries_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;
