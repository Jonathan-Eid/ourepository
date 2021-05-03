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
        email: email,
        password,
        givenName,
        familyName,
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
        request: "GET_ORGS"
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
}

const userApiService = new UserApiService()

export default userApiService;
 
 