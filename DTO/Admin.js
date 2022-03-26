const Organizer = require('./Organizer')
const AdminDomain = require('../Domain/Admin')
let instance;

class Admin extends Organizer{

    static getAdmin(){
        if (instance)
            return instance;
        instance = new Admin();
        return instance;
    }

    getMeetingInTimeSlot(startingTime, endingTime){
        if (!(startingTime && endingTime))
            throw ("please fill all the information");
        if (startingTime >= endingTime)
            throw ("Invalid input!")
        try {
            const admin = AdminDomain.getOrganizer();
            return admin.getMeetingInATimeSlot(startingTime, endingTime);
        }catch (err){
            throw err
        }
    }

    getMeetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");
        try {
            const admin = AdminDomain.getOrganizer(this.email);
            return admin.getMeetingInARoom(roomIdentifier, date);
        }catch (err){
            throw err
        }
    }
}

module.exports = Admin