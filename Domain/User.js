class User {
    constructor(email) {
        this.email = email
    }

    static async getUserByEmail(email) {
        //todo get the data with proto
    }

    static async getUserStatus(email){
        //todo get the data with proto

    }

    static async getUserRole(email){
        //todo get the data with proto
    }

    setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {

    }

    getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector) {

    }

    cancelAMeeting(meetingIdentifier) {

    }

    editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {

    }
}

module.exports = User