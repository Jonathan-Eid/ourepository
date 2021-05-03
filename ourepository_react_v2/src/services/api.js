const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class ApiService {

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

const apiService = new ApiService()

export default apiService;
 
 