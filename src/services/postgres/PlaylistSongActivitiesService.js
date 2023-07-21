const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongActivities {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({
    playlistId, songId, userId, action,
  }) {
    const queryGetSong = {
      text: 'SELECT title FROM songs WHERE id = $1',
      values: [songId],
    };

    const queryGetUser = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [userId],
    };

    const resultSongQuery = await this._pool.query(queryGetSong);
    const resultUserQuery = await this._pool.query(queryGetUser);

    const { title: songTitle } = resultSongQuery.rows[0];

    const { username } = resultUserQuery.rows[0];

    const id = `playlist_song_activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, playlistId, songId, songTitle, userId, username, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Aktivitas gagal ditambahkan');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist_song_activities WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Tidak ada aktivitas playlist');
    }

    const mappedResult = result.rows.map((row) => ({
      username: row.username,
      title: row.song_title,
      action: row.action,
      time: row.time,
    }));

    return mappedResult;
  }
}

module.exports = PlaylistSongActivities;
