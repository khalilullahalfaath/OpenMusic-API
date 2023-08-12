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
      text: 'SELECT id, name, year, cover_url from albums WHERE id = $1',
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

  async updateCover(albumId, newUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [newUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async addAlbumLike(albumId, userId) {
    const id = `user_album_likes-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const queryCheckAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const resultCheckAlbum = await this._pool.query(queryCheckAlbum);

    if (!resultCheckAlbum.rowCount) {
      throw new NotFoundError('Gagal menyukai album. Id tidak ditemukan');
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3, $4)',
      values: [id, createdAt, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menyukai album. Id tidak ditemukan');
    }
  }

  async checkAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus like album. Id tidak ditemukan');
    }
  }

  async getAlbumLikesCount(albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    // change to integer
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = AlbumService;
