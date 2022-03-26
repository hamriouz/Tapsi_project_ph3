const organizer = require('./Organizer');
const {getListAllMeetingInTimeSlot} = require('../DataBaseManager/script');
const {getListOfAllMeetingInRoom} = require('../DataBaseManager/script');

let instanceOfDataAccessAdmin;

class AdminDataAccess extends organizer{

    static getAdmin(){
        if (instanceOfDataAccessAdmin)
            return instanceOfDataAccessAdmin;
        instanceOfDataAccessAdmin = new AdminDataAccess();
        return instanceOfDataAccessAdmin;
    }

    async meetingsInTimeSlot(startingTime, endingTime){
        try {
            return await getListAllMeetingInTimeSlot(startingTime, endingTime);
        }catch (err){
            throw err;
        }


    }

    async meetingsInRoom(roomIdentifier, date){
        try {
            return await getListOfAllMeetingInRoom(roomIdentifier, date);
        }catch (err){
            throw err;
        }
    }
}

module.exports = AdminDataAccess



/*
let allMeetings = [];
allMeetings.push();
allMeetings.push();
allMeetings.push();
if (allMeetings.length === 0)
    throw "No meeting found in the wanted time slot!";
return [...new Set(allMeetings)];
*/

/*
        let allMeetings = [];
        allMeetings.push();
        if (allMeetings.length === 0)
            throw "No meeting found in the wanted room at the given time!";
        return allMeetings;
*/
