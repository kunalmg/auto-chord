create table if not exists content (
  id int primary key default 1,
  site_title text not null,
  hero_title text not null,
  hero_subtitle text not null,
  cta_text text not null,
  updated_at timestamptz default now()
);

