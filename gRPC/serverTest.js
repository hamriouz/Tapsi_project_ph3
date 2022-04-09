const view = require("./View/View");

const PROTO_PATH = "/home/tapsi/Desktop/user_management/services/User_Management/Proto/provides/User.proto";
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

let user_proto = grpc.loadPackageDefinition(packageDefinition).userPackage;

async function getUser(call, callback) {
    try {
        callback(null, {
            user: await view.getUser(call.request.id)
        });
    } catch (err) {
        callback(null, {
            user: null
        });
    }
}

async function isUserInTapsi(call, callback) {
    callback(null, {
        is_in_tapsi: await view.is_user_in_tapsi(call.request.id, call.request.start, call.request.end)
    });
}

async function isEmployee(call, callback) {
    try {
        let id = await view.validate_token(call.request.token);
        callback(null, {
            id: id
        })
    } catch (err) {
        callback(null, {
            error: err
        })
    }
}

async function isAdmin(call, callback) {
    try {
        let id = await view.validate_admin(call.request.token);
        callback(null, {
            id: id
        })
    } catch (err) {
        callback(null, {
            error: err
        })
    }
}

function main() {
    let server = new grpc.Server();
    server.addService(user_proto.User.service, {
        getUser: getUser,
        isUserInTapsi: isUserInTapsi,
        isEmployee: isEmployee,
        isAdmin: isAdmin
    });
    server.bind('localhost:2004', grpc.ServerCredentials.createInsecure());
    server.start();
}

main()

view.run().then(() => null);

