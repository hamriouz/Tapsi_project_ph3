const ProtoConnection = require('../Domain/ProtoConnection');
const protoConnectionInstance = ProtoConnection.getInstance();

class AccessHandler {
    async isAdmin(req, res, next) {
        let isAdmin = await protoConnectionInstance.isRequestSenderAdmin(req.token);
        if (isAdmin === true)
            next();
        else res.status(403).send("Access denied! Please login!")
    }

    async isEmployee(req, res, next) {
        let isEmployee = await protoConnectionInstance.isRequestSenderEmployee(req.token);
        if (isEmployee === true)
            next();
        else res.status(403).send("Access denied! Please login!")

    }

    async canCancel(req, res, next) {
        let canCancel = await protoConnectionInstance.canCancel(req.token);
        if (canCancel === true)
            next();
        else res.status(403).send("Access denied! Please login!")

    }
}

const AccessHandlerInstance = (function () {
    let instance;

    function createInstance() {
        return new AccessHandler();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

module.exports = AccessHandlerInstance;