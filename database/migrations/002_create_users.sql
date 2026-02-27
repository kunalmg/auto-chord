create table if not exists users (
  id serial primary key,
  email text not null unique,
  username text not null,
  password_hash text not null,
  created_at timestamptz default now()
);

