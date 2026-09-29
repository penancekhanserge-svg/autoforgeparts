-- Run in Supabase SQL Editor after creating orders and order_items.
begin;
create or replace function public.place_order(p_checkout_key uuid, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.orders%rowtype;
  product record;
  entry jsonb;
  order_id uuid;
  qty integer;
  amount numeric;
  total numeric := 0;
  result jsonb;
begin
  if p_checkout_key is null or jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Invalid checkout request';
  end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then
    raise exception 'Choose between 1 and 50 products';
  end if;
  -- Serialize retries of the same checkout so only one order is created.
  perform pg_advisory_xact_lock(hashtextextended(p_checkout_key::text, 0));
  select * into existing from public.orders where checkout_key = p_checkout_key;
  if existing.id is not null then
    order_id := existing.id;
  else
    if (select count(distinct value->>'product_id') from jsonb_array_elements(p_items)) <> jsonb_array_length(p_items) then
      raise exception 'Duplicate or missing products';
    end if;
    insert into public.orders(checkout_key,total_amount) values(p_checkout_key,0) returning id into order_id;
    for entry in select value from jsonb_array_elements(p_items) loop
      if jsonb_typeof(entry->'quantity') is distinct from 'number' or (entry->>'quantity') !~ '^[0-9]{1,2}$' then
        raise exception 'Quantity must be a whole number from 1 to 99';
      end if;
      qty := (entry->>'quantity')::integer;
      if qty < 1 or qty > 99 then raise exception 'Invalid quantity'; end if;
      select p.*, c.name as collection_name, m.name as make_name, v.name as model_name
        into product from public.products p
        join public.collections c on c.id=p.collection_id
        join public.vehicle_makes m on m.id=p.make_id
        join public.vehicle_models v on v.id=p.model_id
        where p.id=(entry->>'product_id')::uuid for share of p;
      if not found then raise exception 'A product is no longer available'; end if;
      if product.availability='sold-out' then raise exception 'A product is sold out'; end if;
      amount := round(product.price*(1-product.discount_percent/100),2);
      insert into public.order_items(order_id,product_id,product_name,collection_name,vehicle_make,vehicle_model,year_from,year_to,quantity,unit_price)
        values(order_id,product.id,product.name,product.collection_name,product.make_name,product.model_name,product.year_from,product.year_to,qty,amount);
      total := total + amount*qty;
    end loop;
    update public.orders set total_amount=total where id=order_id;
  end if;
  select to_jsonb(o) - 'checkout_key' || jsonb_build_object('order_items',
    (select coalesce(jsonb_agg(to_jsonb(i)), '[]'::jsonb) from public.order_items i where i.order_id=o.id))
    into result from public.orders o where o.id=order_id;
  return result;
end;
$$;
revoke all on function public.place_order(uuid,jsonb) from public;
grant execute on function public.place_order(uuid,jsonb) to anon, authenticated;
commit;
