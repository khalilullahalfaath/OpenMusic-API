/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('songs', {
    album_id: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('songs', 'album_id');
};
