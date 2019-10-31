let config = require('./../config/config');
const Axios = require('axios-observable').Axios;
let userService = require('./user.service');
let from = require('rxjs').from;
let Observable = require('rxjs').Observable;


let rootApi = process.env.BACKEND || config.service.backend || "http://localhost:3000";
let authApi = process.env.AUTH || config.service.auth || "http://localhost:2999";

function login(username, password) {
  return post(authApi + '/login', {
    username: username,
    password: password
  });
}

function searchLog(payload) {
  return post(rootApi + '/log-view/search', payload);
}

module.exports = {
  login,
  searchLog
}


function handleAuthFail() {
  return (observable) => new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
    const subscription = observable.subscribe({
      next(value) {
        if (value.data.code === 200) {
          observer.next(value);
        } else if (value.data.code === 401) {
          userService.setToken(null);
          observer.next(value);
        } else {
          observer.error({ message: value.data.reason });
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
    return () => {
      subscription.unsubscribe();
    }
  });
}


function get(url) {
  let token = userService.getToken();
  let configHeaders = {};
  if (token) {
    configHeaders = {
      headers: {
        Authorization: token
      }
    }
  }
  return Axios.get(url, configHeaders)
    .pipe(handleAuthFail());
  // return from(new Promise((resolve, reject) => {
  //     axios.get(url, configHeaders)
  //     .then((res) => {
  //         res = res.data;
  //         if (parseInt(res.code) === 401) {
  //             userService.setToken(null);
  //             resolve(res);
  //         }
  //         if (parseInt(res.code) === 200) {
  //             resolve(res);
  //         } else {
  //             reject({
  //                 message: res.reason
  //             });
  //         }
  //     })
  //     .catch((e)=>{
  //         reject(e);
  //     });
  // }));
}

function post(url, payload) {
  let token = userService.getToken();
  let configHeaders = {};
  if (token) {
    configHeaders = {
      headers: {
        Authorization: token
      }
    }
  }
  return Axios.post(url, payload, configHeaders)
    .pipe(handleAuthFail());
  // return from(new Promise((resolve, reject) => {
  //     axios.post(url, payload, configHeaders)
  //     .then((res) => {
  //         res = res.data;
  //         if (parseInt(res.code) === 401) {
  //             userService.setToken(null);
  //             resolve(res);
  //         }
  //         if (parseInt(res.code) === 200) {
  //             resolve(res);
  //         } else {
  //             reject({
  //                 message: res.reason
  //             });
  //         }
  //     })
  //     .catch((e)=>{
  //         reject(e);
  //     });
  // }));
}