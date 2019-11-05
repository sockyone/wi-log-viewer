//user service
let Subject = require('rxjs').Subject;

let token = null;

let tokenSub = new Subject();

module.exports = {
    getToken: function() {
        if (token) return token;
        let readToken = localStorage.getItem("token");
        if (readToken) {
            token = readToken;
        }
        return token;
    },
    isLogin: function() {
        return this.getToken();
    },
    setToken: function(newToken) {
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        token = newToken;
        tokenSub.next(token);
    },
    getTokenSub() {
        return tokenSub;
    }
}