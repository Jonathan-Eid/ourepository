const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class OrganizationApiService {

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

const organizationApiService = new OrganizationApiService()

export default organizationApiService;
 
 