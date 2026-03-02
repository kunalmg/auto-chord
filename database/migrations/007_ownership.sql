alter table if exists users
  add column if not exists role text not null default 'user';

alter table if exists songs
  add column if not exists owner_id int;

do $$
declare uid int;
begin
  select id into uid from users order by id limit 1;
  if uid is null then
    insert into users (email, username, password_hash, role)
    values ('system@autochord.local', 'system', 'x', 'admin')
    returning id into uid;
  end if;
  update songs set owner_id = uid where owner_id is null;
end $$;

alter table if exists songs
  alter column owner_id set not null,
  add constraint songs_owner_fk foreign key (owner_id) references users(id) on delete cascade;

