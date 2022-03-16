class User{
    constructor(email) {
        this.email = email;
    }

    static getUserByEmail(email){
    }

    me(){
        console.log(this)
    }
    setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector){

    }

    getFirstAvailableTime(participants, duration, purpose, office, whiteboard, projector){

    }
    cancelMeeting(meetingIdentifier){

    }
    editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector){

    }


}

module.exports = User