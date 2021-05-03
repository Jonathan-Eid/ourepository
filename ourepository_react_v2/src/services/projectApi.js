const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class ProjectApiService {

  getMosaics(projectUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_MOSAICS",
        projectUuid
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  createMosaic(name, proj, vis, file, filename, sizeBytes, md5Hash, numberChunks) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_MOSAIC",
        name,
        proj,
        vis,
        sizeBytes,
        filename,
        md5Hash,
        numberChunks
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }

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

}

const projectApiService = new ProjectApiService()

export default projectApiService;
 
 