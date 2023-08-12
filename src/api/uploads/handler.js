const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    await this._albumsService.updateCover(albumId, `http://${config.app.host}:${config.app.port}/upload/images/${filename}`);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        coverUrl: `http://${config.app.host}:${config.app.port}/upload/images/${filename}`,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
