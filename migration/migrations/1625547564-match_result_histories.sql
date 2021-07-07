-- Migration: match_result_histories
-- Created at: 2021-07-06 11:59:24
-- ====  UP  ====

BEGIN;
CREATE TABLE "public"."match_result_histories" (
    "id" serial,
    "match_id" varchar(100) NOT NULL,
    "user_id" varchar(100) NOT NULL,
    "click_times" int NOT NULL,
    "end_time" timestamp NOT NULL, 
    PRIMARY KEY ("id")
);
COMMIT;

-- ==== DOWN ====

BEGIN;

COMMIT;
