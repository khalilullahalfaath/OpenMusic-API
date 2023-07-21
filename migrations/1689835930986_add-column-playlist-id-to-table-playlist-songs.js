/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('playlist_songs', {
    playlist_id: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('playlist_songs', 'playlist_id');
};
