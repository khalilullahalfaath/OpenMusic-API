const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapAlbumDBToModel, mapSongAlbumIdDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryGetAlbum = {
      text: 'SELECT * from albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(queryGetAlbum);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albumData = result.rows[0];
    const album = mapAlbumDBToModel(albumData);

    const queryGetSongsByAlbumId = {
      text: 'SELECT * from songs WHERE album_id = $1',
      values: [id],
    };

    const songsResult = await this._pool.query(queryGetSongsByAlbumId);
    const songs = songsResult.rows.map(mapSongAlbumIdDBToModel);

    album.songs = songs;

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
