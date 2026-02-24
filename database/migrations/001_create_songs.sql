create table if not exists songs (
  id serial primary key,
  title text not null,
  artist text,
  created_at timestamptz default now()
);
