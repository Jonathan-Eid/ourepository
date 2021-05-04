const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "apis/api_v2.php"

class OrganizationApiService {

  createProject(name, org) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_PROJECT",
        name,
        org
      }),
      withCredentials: true,
      responseType: 'text'
    });
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

  getOrganization(uuid){
    return axios({
        method: 'get',
        url ,
        params: {
            request:"GET_ORGANIZATION",
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

  hasPermission(permission, organization) {
    return axios({
      method: 'get',
      url,
      params: {
        request: "HAS_ORGANIZATION_PERMISSION",
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
        request: "GET_ORGANIZATION_ROLES",
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
        request: "GET_ORGANIZATION_USERS",
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

  addRole(roleName, changes,organization) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "ADD_ROLE",
        roleName,
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
        roleId: role['id']
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }
}

const organizationApiService = new OrganizationApiService()

export default organizationApiService;
 
 