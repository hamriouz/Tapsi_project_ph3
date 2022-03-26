const organizerDomain = require('./Organizer')
const dataAccess = require('../DataAccess/Admin')

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
            const admin = dataAccess.getAdmin();
            return admin.meetingsInTimeSlot(startingTime, endingTime)
        }catch (err){
            throw err
        }
    }

    getMeetingInARoom(roomIdentifier, date) {
        try{
            const admin = dataAccess.getAdmin();
            return admin.meetingsInRoom(roomIdentifier, date)
        }catch (err){
            throw err
        }
    }

}

module.exports = AdminDomain