const Joi = require('joi');

const ExportSongsOnPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSongsOnPlaylistPayloadSchema;
