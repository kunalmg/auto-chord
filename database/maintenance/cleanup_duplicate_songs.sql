-- Keeps the most recent (by coalesce(updated_at, created_at)) row for each (lower(title), lower(artist))
with ranked as (
  select id,
         lower(title) as t,
         coalesce(lower(artist),'') as a,
         row_number() over (
           partition by lower(title), coalesce(lower(artist),'')
           order by coalesce(updated_at, created_at) desc, id desc
         ) as rn
  from songs
)
delete from songs s
using ranked r
where s.id = r.id
  and r.rn > 1;

