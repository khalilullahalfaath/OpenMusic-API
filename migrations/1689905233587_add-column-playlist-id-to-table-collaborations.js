/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('collaborations', {
    playlist_id: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('collaborations', 'playlist_id');
};
