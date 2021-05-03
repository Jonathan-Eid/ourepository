const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class ApiService {


  createUser(email, given_name, family_name, password, shake) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_USER",
        email: email,
        password,
        given_name,
        family_name,
        shake: shake
      }),
      responseType: 'text'
    });
  }

  loginUser(email, password) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "LOGIN_USER",
        email: email,
        password,
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  isAuth() {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_AUTH"
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  logout() {
    return axios({
      method: 'get',
      url,
      params: {
        request: "LOGOUT_USER"
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  createOrg(name, visible) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_ORG",
        name,
        visible,
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  createProject(name, org) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_PROJ",
        name,
        org
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

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

  addUser(email,org,role){
    return axios({
        method: 'post',
        url,
        data: new URLSearchParams({
            request:"ADD_USER",
            email,
            org,
            role
        }),
        withCredentials: true,
        responseType: 'text'
    })
}

getOrgByUUID(uuid){
    return axios({
        method: 'get',
        url ,
        params: {
            request:"GET_AUTH_ORG_BY_UUID",
            uuid
        },
        withCredentials: true,
        responseType: 'text'
      });
}

  getSidebarOrgs() {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_SIDEBAR_ORGS"
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getOrgs() {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORGS"
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getMosaics(project) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_MOSAICS",
        project
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

  getProjects(org) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_PROJECTS",
        org
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  addUser(email, org, role) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "ADD_USER",
        email,
        org,
        role
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }

  getOrgByName(name) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_AUTH_ORG_BY_NAME",
        name
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  hasPermission(permission, organization) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "HAS_ORG_PERMISSION",
        permission,
        organization
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getOrgRoles(organization) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORG_ROLES",
        organization
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getOrgUsers(organization) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORG_USERS",
        organization
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getRolePermissions(role) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ROLE_PERMISSIONS",
        role_id: role['id']
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  changeRolePermissions(role, changes) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CHANGE_ROLE_PERMISSIONS",
        role_id: role['id'],
        changes
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  addRole(role_name, changes,organization) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "ADD_ROLE",
        role_name,
        changes,
        organization
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  deleteRole(role) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "DELETE_ROLE",
        role_id: role['id']
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

}

const apiService = new ApiService()

export default apiService 
 
 