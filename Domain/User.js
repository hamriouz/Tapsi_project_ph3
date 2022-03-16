class User {
    constructor(email) {
        this.email = email
    }
    static getUserByEmail(email) {
        /*    if (!(email))
                throw ("please fill all the information");
            try {

            } catch (err) {
                throw err
            }*/
    }

    setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        /*    if (!(title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
                throw ("please fill all the information");
            try {

            } catch (err) {
                throw err
            }*/
    }

    getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector) {
        /*    if (!(participants && duration && purpose && office && whiteboard && projector))
                throw ("please fill all the information");
            try {

            } catch (err) {
                throw err
            }*/
    }

    cancelAMeeting(meetingIdentifier) {
        /*    if (!(meetingIdentifier))
                throw ("please fill all the information");
            try {

            } catch (err) {
                throw err
            }*/
    }

    editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        /*    if (!(meetingIdentifier && title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
                throw ("please fill all the information");
            try {

            } catch (err) {
                throw err
            }*/
    }
}

module.exports = User