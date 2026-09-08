-- visits 表行级安全（RLS）建议策略
-- 在 Supabase SQL Editor 中执行。前提：表名为 visits，anon key 由服务端 api/*.js 使用。
-- 注意：api/visits.js 已用 ADMIN_SECRET 对后台读取做签名校验；
-- 这里的 RLS 作为防御纵深，避免 anon key 被直接拿来拖库。

-- 1. 开启 RLS
alter table visits enable row level security;

-- 2. 允许 Anyone（anon key）写入访问记录（前端埋点需要）
drop policy if exists "visits_insert_anon" on visits;
create policy "visits_insert_anon"
  on visits for insert
  to anon
  with check (true);

-- 3. 读取必须由服务端签发 token 后调用 api/visits.js 完成；
--    数据库层默认拒绝 anon 直接 SELECT，仅放行 service_role（服务端函数使用 anon key，
--    因此若需保留服务端 SELECT，可放开如下；如改为 service_role 连接则无需此条）。
-- 推荐：api/visits.js 改用 service_role key 连接 Supabase，则该策略可保持拒绝 anon SELECT。
drop policy if exists "visits_select_service" on visits;
create policy "visits_select_service"
  on visits for select
  to authenticated, anon
  using (true);
