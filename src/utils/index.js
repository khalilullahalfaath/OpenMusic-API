/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  id,
  name,
  year,
  cover_url,
  created_at,
  updated_at,

}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongAlbumIdDBToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapSongAlbumIdDBToModel };
