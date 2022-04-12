const userClient = require('../gRPC/userClient');

class ProtoConnection {
    async isRequestSenderAdmin(token){
        return await userClient.isWantedRole(token, "admin");
    }

    async isRequestSenderEmployee(token){
        return await userClient.isWantedRole(token, "employee");
    }

    async canCancel(token){
        return await userClient.canCancel(token);
    }

}

const ProtoConnectionInstance = (function () {
    let instance;

    function createInstance() {
        return new ProtoConnection();
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

module.exports = ProtoConnectionInstance;