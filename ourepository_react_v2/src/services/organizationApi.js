const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "apis/api_v2.php"

class OrganizationApiService {

  createProject(name, organizationUuid) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_PROJECT",
        name,
        organizationUuid
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  addUser(email, organizationUuid, role) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "ADD_USER",
        email,
        organizationUuid,
        role
      }),
      withCredentials: true,
      responseType: 'text'
    })
  }

  getOrganization(uuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORGANIZATION",
        uuid
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getProjects(organizationUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_PROJECTS",
        organizationUuid
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  hasPermission(permission, organizationUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "HAS_ORGANIZATION_PERMISSION",
        permission,
        organizationUuid
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getOrgRoles(organizationUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORGANIZATION_ROLES",
        organizationUuid
      },
      withCredentials: true,
      responseType: 'text'
    });
  }

  getOrgUsers(organizationUuid) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORGANIZATION_USERS",
        organizationUuid
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
        roleId: role['id']
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
        roleId: role['id'],
        changes
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }

  addRole(roleName, changes, organizationUuid) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "ADD_ROLE",
        roleName,
        changes,
        organizationUuid
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
        roleId: role['id']
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }
}

const organizationApiService = new OrganizationApiService()

export default organizationApiService;
 
 