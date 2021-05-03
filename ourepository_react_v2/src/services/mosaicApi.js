const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class MosaicApiService {

  uploadChunk(chunk, identifier, md5_hash, part) {
    const formData = new FormData();
    formData.append('request', "UPLOAD_CHUNK");
    formData.append('chunk', chunk);
    formData.append('identifier', identifier);
    formData.append('md5_hash', md5_hash);
    formData.append('part', part);


    return axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: true,
      responseType: 'text'
    })

  }

  getMosaicCard(mosaicUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_MOSAIC_CARD",
        mosaicUuid
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  getMosaicData(mosaicUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_MOSAIC_DATA",
        mosaicUuid
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  uploadAnnotationCSV(mosaicUuid, csv) {
    const formData = new FormData();
    formData.append('request', "UPLOAD_ANNOTATION_CSV");
    formData.append('mosaicUuid', mosaicUuid);
    formData.append('csv', csv);

    return axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  exportLabelCsv(mosaicUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "EXPORT_LABEL_CSV",
        mosaicUuid
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  inferenceMosaic(name, imagePath, model, width, height, strideLength) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "INTERFACE_MOSAIC",
        name,
        imagePath,
        model,
        width,
        height,
        strideLength
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }
}

const mosaicApiService = new MosaicApiService()

export default mosaicApiService;
 
 