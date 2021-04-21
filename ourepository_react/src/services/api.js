const fetch = require('node-fetch');
const axios = require('../config/axios');

const url = "api_v2.php"

class ApiService {


    createUser(email,given_name,family_name,password,shake){
        return axios({
            method: 'post',
            url,
            data: new URLSearchParams({
                request:"CREATE_USER",
                email: email,
                password,
                given_name,
                family_name,
                shake:shake
            }),
            responseType: 'text'
          });
    }

    loginUser(email, password){
        return axios({
            method: 'post',
            url ,
            data: new URLSearchParams({
                request:"LOGIN_USER",
                email: email,
                password,
            }),
            withCredentials: true,
            responseType: 'text'
          });
    }

    isAuth(){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"GET_AUTH"
            },
            withCredentials: true,
            responseType: 'text'
          });
    }

    logout(){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"LOGOUT_USER"
            },
            withCredentials: true,
            responseType: 'text'
          });
    }

    createOrg(name, visible){
        return axios({
            method: 'post',
            url ,
            data: new URLSearchParams({
                request:"CREATE_ORG",
                name,
                visible,
            }),
            withCredentials: true,
            responseType: 'text'
          });
    }
    createProject(name,org){
        return axios({
            method: 'post',
            url,
            data: new URLSearchParams({
                request:"CREATE_PROJ",
                name,
                org
            }),
            withCredentials: true,
            responseType: 'text'
        });
    }
    createMosaic(name,proj,vis,file){
        return axios({
            method: 'post',
            url,
            data: new URLSearchParams({
                request:"CREATE_MOS",
                name,
                proj,
                vis,
                file
            })
        })
    }

    getOrgs(){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"GET_ORGS"
            },
            withCredentials: true,
            responseType: 'text'
          });
    }

    getMosaics(project){
        return axios({
            method: 'get',
            url ,
            params: {
                request: "GET_MOSAICS",
                project
            },
            withCredentials: true,
            responseType: 'text'
        })
    }

    getProjects(org){
        return axios({
            method: 'get',
            url ,
            params: {
                request: "GET_PROJECTS",
                org
            },
            withCredentials: true,
            responseType: 'text'
        })
    }

    getMosaics(proj){
        return axios({
            method: 'get',
            url ,
            params: {
                request: "GET_MOSAICS",
                proj
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
    getOrgByName(name){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"GET_AUTH_ORG_BY_NAME",
                name
            },
            withCredentials: true,
            responseType: 'text'
          });
    }

    hasPermission(permission,organization){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"HAS_ORG_PERMISSION",
                permission,
                organization
            },
            withCredentials: true,
            responseType: 'text'
          });
    }

    getOrgRoles(organization){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"GET_ORG_ROLES",
                organization
            },
            withCredentials: true,
            responseType: 'text'
          });
    }
    getRolePermissions(role){
        return axios({
            method: 'get',
            url ,
            params: {
                request:"GET_ROLE_PERMISSIONS",
                role_id: role['id'] 
            },
            withCredentials: true,
            responseType: 'text'
          });
    }
    cropMosaic(name,dataDir,width,height,strideLength,ratio){
        return axios({
            method: 'post',
            url,
            data: new URLSearchParams({
                request:"CROP_MOSAIC",
                name,
                dataDir,
                width,
                height,
                strideLength,
                ratio
            }),
            withCredentials: true,
            responseType: 'text'
        })
    }
    interfaceMosaic(name,imagePath,model,width,height,strideLength){
        return axios({
            method: 'post',
            url,
            data: new URLSearchParams({
                request:"INTERFACE_MOSAIC",
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

}

const apiService = new ApiService()

export default apiService 
 
 