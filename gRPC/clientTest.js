const PROTO_PATH = "/home/tapsi/Desktop/user_management/services/Meeting_Management/Proto/consumes/User.proto";
const grpc = require("@grpc/grpc-js");
const Promise = require('bluebird');
let protoLoader = require("@grpc/proto-loader");
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};


let packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const user_proto = grpc.loadPackageDefinition(packageDefinition);

const user = user_proto.userPackage;

const client = new user.User(
    "localhost:2004",
    grpc.credentials.createInsecure()
);


class UserDAO {
    static async getUser(id) {
        client.getUser = Promise.promisify(client.getUser);
        return await client.getUser({"id": id});
    }

    static async isUserInTapsi(id, start, end) {
        client.isUserInTapsi = Promise.promisify(client.isUserInTapsi);
        return await client.isUserInTapsi({"id": id, "start": start, "end": end});
    }

    static async isEmployee(token) {
        client.isEmployee = Promise.promisify(client.isEmployee);
        return await client.isEmployee({"token": token});
    }

    static async isAdmin(token) {
        client.isAdmin = Promise.promisify(client.isAdmin);
        return await client.isAdmin({"token": token});
    }
}

module.exports = UserDAO;