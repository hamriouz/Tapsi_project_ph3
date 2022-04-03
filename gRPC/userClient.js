const PROTO_PATH = __dirname + './user.proto';
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
    async static getUserWorkingHour(userID) {

        client.getWorkingHour = Promise.promisify(client.getWorkingHour);
        return await client.getWorkingHour({id: userID});
    }

    async static validateToken(token){
        client.validateToken = Promise.promisify(client.validateToken);
        return await client.validateToken({token: token});
    }
}