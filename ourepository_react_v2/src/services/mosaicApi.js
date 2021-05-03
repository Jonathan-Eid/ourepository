const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "apis/api_v2.php"

class MosaicApiService {

  uploadChunk(chunk, identifier, md5Hash, part) {
    const formData = new FormData();
    formData.append('request', "UPLOAD_CHUNK");
    formData.append('chunk', chunk);
    formData.append('identifier', identifier);
    formData.append('md5Hash', md5Hash);
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

  getMosaic(mosaicUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_MOSAIC",
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
        request: "INFERENCE_MOSAIC",
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
 
 