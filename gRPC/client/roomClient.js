const PROTO_PATH = __dirname + '/room.proto';
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

let room_proto = grpc.loadPackageDefinition(packageDefinition).room;

let client = new room_proto.Room('localhose:4500',
    grpc.credentials.createInsecure());

class roomClient {
    static async getRoomCapacity(roomIdentifier) {
        client.getRoomCapacity = Promise.promisify(client.getRoomCapacity);
        return await client.getRoomCapacity({"roomIdentifier": roomIdentifier});
    }

    static async getRoomIdentifier(office, name) {
        client.getRoomIdentifier = Promise.promisify(client.getRoomIdentifier);
        return await client.getRoomIdentifier({"office": office, "name": name});
    }
}

module.exports = roomClient;

/*
class roomClient {
    static async getRoomCapacity(roomIdentifier) {

        client.getRoomCapacity = Promise.promisify(client.getRoomCapacity);
        return await client.getRoomCapacity({"roomIdentifier": roomIdentifier});
    }

    async static getRoomIdentifier(name, office) {
        client.getRoomIdentifier = Promise.promisify(client.getRoomIdentifier);
        return await client.getRoomIdentifier({name: name, office: office});
    }
}

function main() {
    let client = new room_proto.Room('localhost:4500',
        grpc.credentials.createInsecure());
}

*/
