drop index if exists songs_title_artist_uniq;
create unique index if not exists songs_title_artist_owner_uniq
  on songs (lower(title), coalesce(lower(artist), ''), owner_id);

