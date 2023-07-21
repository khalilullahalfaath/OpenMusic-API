const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $3, $4) RETURNING id',
      values: [id, name, createdAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT id, name, owner as username FROM playlists WHERE owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof AuthorizationError) {
        throw error;
      }
    }

    /* TODO: for collaboration feature
    (if needed) then implement try catch here for verify playlist collaborator */
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    const playlistWithUserQuery = {
      text: 'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId],
    };

    const playlistWithUserResult = await this._pool.query(playlistWithUserQuery);

    if (!playlistWithUserResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songsQuery = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const playlist = playlistWithUserResult.rows[0];
    const resultSongsQuery = await this._pool.query(songsQuery);

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: resultSongsQuery.rows,
    };
  }

  async deleteSongFromPlaylistById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistsService;
