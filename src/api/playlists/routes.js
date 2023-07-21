const routes = (handler) => [
  {
    path: '/playlists',
    method: 'POST',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists',
    method: 'GET',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists/{id}',
    method: 'DELETE',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists/{id}/songs',
    method: 'POST',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists/{id}/songs',
    method: 'GET',
    handler: handler.getSongsFromPlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists/{id}/songs',
    method: 'DELETE',
    handler: handler.deleteSongFromPlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    path: '/playlists/{id}/activities',
    method: 'GET',
    handler: handler.getPlaylistSongsActivityHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },

];

module.exports = routes;
