const User = require('./User')
const meetingDataBase = require('../DataAccess/MeetingDataBase')

class Admin extends User {

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