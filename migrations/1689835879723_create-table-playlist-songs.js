/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
