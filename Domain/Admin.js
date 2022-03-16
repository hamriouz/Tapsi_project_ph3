const User = require('./User')
class Admin extends User{/*
    constructor() {
        super();
    }*/

    printEmail(){
        console.log(this.email)
    }
    getMeetingInTimeSlot(meetingIdentifier){

    }
    getMeetingInRoom(roomIdentifier, date){

    }

}

module.exports = Admin