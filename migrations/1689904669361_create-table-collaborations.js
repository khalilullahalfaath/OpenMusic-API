/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
