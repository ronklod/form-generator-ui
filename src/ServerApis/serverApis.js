import axios from "axios";

const SERVER_BASE_URL = "http://localhost";
const SERVER_PORT ="3000";//window.location.port;//"3001";
const SERVER_ADDRESS = SERVER_BASE_URL + ":" + SERVER_PORT;

const get = (route, onSuccess, onFail) => {
    const url = SERVER_ADDRESS + route;
    axios.get(url).then((result) => {
        onSuccess(result);
    }).catch(err => {
        onFail(err);
        console.log(err);
    }).then(() => {
        // always executed
    });
}

const post = (route, data, headers, onSuccess, onFail) => {
    const url = SERVER_ADDRESS + route;
    axios.post(url, data, headers).then(result =>{
        console.log(result);
        onSuccess(result);
    }).catch(function (error) {
        console.log(error);
        onFail(error);
    });
}

const put = (route, data, headers,  onSuccess, onFail) => {
    const url = SERVER_ADDRESS + route;
    axios.put(url, data, headers).then(result =>{
        console.log(result);
        onSuccess(result);
    }).catch(function (error) {
        console.log(error);
        onFail(error);
    });
}

const del = (route, data,headers, onSuccess, onFail) =>{
    const url = SERVER_ADDRESS + route;
    axios.delete(url,{headers, 'data':data}).then(result=>{
        onSuccess(result);
    }).catch(err => {
        console.log(err);
        onFail(err);
    });
}

const getServerAddress = () => {
    return SERVER_ADDRESS;
}


export default {get, post,put, del, getServerAddress};