const User = require('./Organizer')
const meetingDataBase = require('../DataAccess/MeetingDataBase')
const Console = require("console");

let instance;

class Admin extends User {

    static getOrganizer(){
        if (instance)
            return instance;
        instance = new Admin();
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

module.exports = Admin