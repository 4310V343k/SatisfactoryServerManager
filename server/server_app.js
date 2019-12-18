const CryptoJS = require("crypto-js");

const logger = require("./server_logger");
const Cleanup = require("./server_cleanup");
const Config = require("./server_config");

class SSM_Server_App {

    constructor() {

    }

    init() {
        logger.info("[SERVER_APP] [INIT] - Starting Server App...");
    }

    checkLoggedInMiddleWare(req, res, next) {
        if (req.session.loggedin == true) {
            req.isLoggedin = true;
            req.session.touch();
            next();
        } else {
            req.isLoggedin = false;
            next();
        }
    }

    loginUserAccount(req, res, next) {
        const post = req.body;
        const user = post.inp_user;
        const pass = post.inp_pass;

        const users = Config.get("ssm.users");
        const UserAccount = users.find(el => el.username == user);
        const UserId = users.findIndex(el => el.username == user);

        var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (UserAccount == null || typeof UserAccount === 'undifined') {
            req.loginresult = "error";
            req.loginerror = "User Doesn't Exist!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed Login Attempt from " + clientip)

            next();
            return;
        }

        const defaultpasshash = CryptoJS.MD5("SSM:admin-ssm").toString();

        const passString = "SSM:" + UserAccount.username + "-" + pass;
        const passhash = CryptoJS.MD5(passString).toString();

        if (UserAccount.username != user || UserAccount.password != passhash) {
            req.loginresult = "error";
            req.loginerror = "Invalid Login Credientials!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed Login Attempt from " + clientip)

            next();
            return;
        }

        req.loginresult = "success";
        req.session.loggedin = true;
        req.session.userid = UserId;

        if (UserAccount.password == defaultpasshash) {
            req.changepass = true;
            req.session.changepass = true;
        } else {
            req.changepass = false;
        }

        logger.debug("[SERVER_APP] [LOGIN] - Successful Login from " + clientip + " User:" + UserAccount.username)
        next();
        return;
    }

    changeUserDefaultPassword(req, res, next) {
        if (req.session.loggedin != true) {
            req.isLoggedin = false;
            next();
            return;
        }

        const UserAccount = Config.get("ssm.users." + req.session.userid)

        if (UserAccount == null || typeof UserAccount === 'undifined') {
            req.passchangeresult = "error";
            req.passchangeerror = "Server Error";

            logger.warn("[SERVER_APP] [LOGIN] - Failed change default password Attempt from " + clientip)

            next();
            return;
        }

        const post = req.body;
        const pass1 = post.inp_pass1;
        const pass2 = post.inp_pass2;

        const pass1String = "SSM:" + UserAccount.username + "-" + pass1;
        const pass2String = "SSM:" + UserAccount.username + "-" + pass2;

        const pass1hash = CryptoJS.MD5(pass1String).toString();
        const pass2hash = CryptoJS.MD5(pass2String).toString();

        const defaultpasshash = CryptoJS.MD5("ssm").toString();

        var clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (pass1hash != pass2hash) {
            req.passchangeresult = "error";
            req.passchangeerror = "Passwords dont match!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed change default password Attempt from " + clientip)

            next();
            return;
        }

        if (pass1 == UserAccount.username) {
            req.passchangeresult = "error";
            req.passchangeerror = "You can't use the same password as your username!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed change default password Attempt from " + clientip)

            next();
            return;
        }

        if (pass1hash == UserAccount.password) {
            req.passchangeresult = "error";
            req.passchangeerror = "The password you entered is the same as the current one!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed change default password Attempt from " + clientip)

            next();
            return;
        }

        if (pass1hash == defaultpasshash) {
            req.passchangeresult = "error";
            req.passchangeerror = "You can't use the default password!";

            logger.warn("[SERVER_APP] [LOGIN] - Failed change default password Attempt from " + clientip)

            next();
            return;
        }

        req.passchangeresult = "success";

        Config.set("ssm.users." + req.session.userid + ".password", pass1hash);

        // Make the user resigin.
        req.session.loggedin = false;
        req.session.userid = null;
        req.session.changepass = false;
        req.session.touch();
        next();
    }
}

const SSM_server_app = new SSM_Server_App();

module.exports = SSM_server_app;