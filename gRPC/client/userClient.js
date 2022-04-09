const PROTO_PATH = __dirname + '/user.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const Promise = require('bluebird');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

let user_proto = grpc.loadPackageDefinition(packageDefinition).user;

let client = new user_proto.User('localhost:4500',
    grpc.credentials.createInsecure());

class userClient {
    static async getUserWorkingHour(identifier){
        client.getUserWorkingHour = Promise.promisify(client.getUserWorkingHour);
        return await client.getUserWorkingHour({"identifier": identifier});
    }

    static async isWantedRole(token, role){
        client.isWantedRole = Promise.promisify(client.isWantedRole);
        return await client.isWantedRole({"token": token, "role": role});
    }

    static async canCancel(token){
        client.canCancel = Promise.promisify(client.canCancel);
        return await client.canCancel({"token": token})
    }
}

module.exports = userClient;

