
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


//todo move to room server
/*
function getRoomIdentifier(call, callback){
        try{
                callback(null, {
                        roomIdentifier: await //todo
                });
        }catch (err){
                callback(null, {
                        roomIdentifier: null
                });
        }
}
*/

/*class roomClient{
    async static getRoomCapacityByIdentifier(roomIdentifier){

        client.getRoomCapacityByIdentifier = Promise.promisify(client.getRoomCapacityByIdentifier);
        return await client.getRoomCapacityByIdentifier({"roomIdentifier": roomIdentifier});
    }

    async static getRoomIdentifierByNameAndOffice(name, office){
        client.getRoomIdentifierByNameAndOffice = Promise.promisify(client.getRoomIdentifierByNameAndOffice);
        return await client.getRoomIdentifierByNameAndOffice({name: name, office: office});
    }
}





*/




