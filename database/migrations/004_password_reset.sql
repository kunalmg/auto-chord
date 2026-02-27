create table if not exists password_reset_tokens (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);

