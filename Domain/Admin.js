const organizerDomain = require('./Organizer')
const meetingDataBase = require('../DataAccess/MeetingDataBase')

let instance;

class AdminDomain extends organizerDomain {

    static getOrganizer(){
        if (instance)
            return instance;
        instance = new AdminDomain();
        return instance;
    }

    getMeetingInATimeSlot(startingTime, endingTime) {
        try{
            return meetingDataBase.meetingsInTimeSlot(startingTime, endingTime)
        }catch (err){
            throw err
        }
    }

    getMeetingInARoom(roomIdentifier, date) {
        try{
            return meetingDataBase.meetingsInRoom(roomIdentifier, date);

        }catch (err){
            throw err
        }
    }

}

module.exports = AdminDomain