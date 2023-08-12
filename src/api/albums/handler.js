const autobind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autobind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const liked = await this._service.checkAlbumLike(albumId, credentialId);

    if (liked) {
      return h.response({
        status: 'fail',
        message: 'Like gagal ditambahkan. Anda sudah memberikan like pada album ini',
      }).code(400);
    }

    await this._service.addAlbumLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeByIdHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const liked = await this._service.checkAlbumLike(albumId, credentialId);

    if (!liked) {
      return {
        status: 'fail',
        message: 'Like gagal dihapus. Anda tidak pernah memberikan like pada album ini',
      };
    }

    await this._service.deleteAlbumLike(albumId, credentialId);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getAlbumLikesByIdHandler(request) {
    const { id: albumId } = request.params;
    const likes = await this._service.getAlbumLikesCount(albumId);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = AlbumsHandler;
