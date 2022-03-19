const UserDomain = require('../Domain/User')
class User {
    constructor(email) {
        this.email = email;
    }

    static getUserByEmail(email) {
        if (!(email))
            throw ("please fill all the information");
        try {
            return UserDomain.getUserByEmail(email);
        } catch (err) {
            throw err
        }
    }

    static getRole(email){
        if (!(email))
            throw ("please fill all the information");
        try {
            return UserDomain.getUserRole(email);
        } catch (err) {
            throw err
        }
    }

    static getStatus(email){
        if (!(email))
            throw ("please fill all the information");
        try {
            return UserDomain.getUserStatus(email);
        } catch (err) {
            throw err
        }
    }

    setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = UserDomain.getUserByEmail(this.email);
            user.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }


    getFirstAvailableTime(participants, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = UserDomain.getUserByEmail(this.email);
            return user.getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    cancelMeeting(meetingIdentifier) {
        if (!(meetingIdentifier))
            throw ("please fill all the information");
        try {
            const user = UserDomain.getUserByEmail(this.email);
            user.cancelAMeeting(meetingIdentifier)
        } catch (err) {
            throw err
        }
    }

    editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        if (!(meetingIdentifier && title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = UserDomain.getUserByEmail(this.email);
            user.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector)
        } catch (err) {
            throw err
        }
    }

}

module.exports = User