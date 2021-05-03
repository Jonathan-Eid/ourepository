const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class ProjectApiService {

  createMosaic(name, proj, vis, file, filename, size_bytes, md5_hash, number_chunks) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_MOSAIC",
        name,
        proj,
        vis,
        size_bytes,
        filename,
        md5_hash,
        number_chunks
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }

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
}

const projectApiService = new ProjectApiService()

export default projectApiService;
 
 