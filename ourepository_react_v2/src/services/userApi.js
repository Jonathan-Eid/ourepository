const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "apis/api_v2.php"

class UserApiService {

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

  createUser(email, givenName, familyName, password, shake) {
    return axios({
      method: 'post',
      url,
      data: new URLSearchParams({
        request: "CREATE_USER",
        email,
        password,
        givenName,
        familyName,
        shake
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
        email,
        password,
      }),
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

  getOrgs() {
    return axios({
      method: 'get',
      url,
      params: {
        request: "GET_ORGANIZATIONS"
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
        request: "GET_SIDEBAR_ORGANIZATIONS"
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
        request: "CREATE_ORGANIZATION",
        name,
        visible,
      }),
      withCredentials: true,
      responseType: 'text'
    });
  }
}

const userApiService = new UserApiService()

export default userApiService;
 
 