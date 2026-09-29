-- Run once in Supabase SQL Editor. Existing references remain valid.
begin;
lock table public.orders in access exclusive mode;
create sequence if not exists public.order_reference_number_seq;
select setval('public.order_reference_number_seq', greatest(
 (select last_value + case when is_called then 1 else 0 end from public.order_reference_number_seq),
 coalesce((select max(substring(reference from 4)::bigint)+1 from public.orders where reference ~ '^AF-[0-9]{3,12}$'),1)
), false);
create or replace function public.next_order_reference()
returns text language sql volatile set search_path='' as $$
 select 'AF-' || case when n<1000 then lpad(n::text,3,'0') else n::text end
 from (select nextval('public.order_reference_number_seq') as n) numbers;
$$;
revoke all on function public.next_order_reference() from public;
alter table public.orders alter column reference set default public.next_order_reference();
commit;
