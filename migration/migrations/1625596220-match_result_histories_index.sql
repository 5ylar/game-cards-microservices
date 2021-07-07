-- Migration: match_result_histories_index
-- Created at: 2021-07-07 01:30:20
-- ====  UP  ====

BEGIN;
CREATE INDEX "match_result_histories_click_times_idx" ON "public"."match_result_histories" USING BTREE ("click_times");
CREATE INDEX "match_result_histories_user_id_idx" ON "public"."match_result_histories" USING BTREE ("user_id");
CREATE INDEX "match_result_histories_user_id__click_times_idx" ON "public"."match_result_histories" USING BTREE ("user_id","click_times");
COMMIT;

-- ==== DOWN ====

BEGIN;

COMMIT;
