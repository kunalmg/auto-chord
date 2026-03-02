alter table if exists songs
  add column if not exists key_scale text,
  add column if not exists capo int,
  add column if not exists difficulty text,
  add column if not exists tempo int,
  add column if not exists strumming_pattern text,
  add column if not exists tuning text,
  add column if not exists genre text,
  add column if not exists tags text[],
  add column if not exists description text,
  add column if not exists chord_progression text,
  add column if not exists youtube_link text,
  add column if not exists reference_link text,
  add column if not exists formatted text,
  add column if not exists release_date date,
  add column if not exists updated_at timestamptz default now();

create unique index if not exists songs_title_artist_uniq on songs (lower(title), coalesce(lower(artist), ''));

