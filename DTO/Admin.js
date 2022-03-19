const User = require('./User')
const AdminDomain = require('../Domain/Admin')

class Admin extends User{

    getMeetingInTimeSlot(startingTime, endingTime){
        if (!(startingTime && endingTime))
            throw ("please fill all the information");
        if (startingTime >= endingTime)
            throw ("Invalid input!")
        try {
            const admin = AdminDomain.getUserByEmail(this.email);
            return admin.getMeetingInATimeSlot(startingTime, endingTime);
        }catch (err){
            throw err
        }
    }
    getMeetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");
        try {
            const admin = AdminDomain.getUserByEmail(this.email);
            return admin.getMeetingInARoom(roomIdentifier, date);
        }catch (err){
            throw err
        }
    }

}

module.exports = Admin