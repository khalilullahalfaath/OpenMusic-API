/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('collaborations', {
    user_id: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('collaborations', 'user_id');
};
