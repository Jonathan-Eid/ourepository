const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "apis/api_v2.php"

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

  createMosaic(name, projectUuid, vis, file, filename, sizeBytes, md5Hash, numberChunks) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_MOSAIC",
        name,
        projectUuid,
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

  submitTrainingJob(mosaicUuids, modelWidth, modelHeight, strideLength, ratio,
                    modelName, continueFromCheckpoint) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "SUBMIT_TRAINING_JOB",
        mosaicUuids,
        // crop phase
        modelWidth,
        modelHeight,
        strideLength,
        ratio,
        // train phase
        modelName,
        continueFromCheckpoint,
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }


}

const projectApiService = new ProjectApiService()

export default projectApiService;
 
 