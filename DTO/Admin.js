const User = require('./User')
const AdminDomain = require('../Domain/Admin')

class Admin extends User{

    getMeetingInTimeSlot(meetingIdentifier){
        if (!(meetingIdentifier))
            throw ("please fill all the information");
        try {
            const admin = AdminDomain.getUserByEmail(this.email);
            admin.getMeetingInATimeSlot(meetingIdentifier);
        }catch (err){
            throw err
        }
    }
    getMeetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");
        try {
            const admin = AdminDomain.getUserByEmail(this.email);
            admin.getMeetingInARoom(roomIdentifier, date)
        }catch (err){
            throw err
        }
    }

}

module.exports = Admin