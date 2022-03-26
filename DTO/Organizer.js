const organizerDomain = require('../Domain/Organizer')

let InstanceOfOrganizerDTO;

class Organizer {
    constructor() {
    }

    static getOrganizer() {
        if (InstanceOfOrganizerDTO)
            return InstanceOfOrganizerDTO;
        InstanceOfOrganizerDTO = new Organizer();
        return InstanceOfOrganizerDTO;
    }

    static getRole(email) {
        if (!(email))
            throw ("please fill all the information");
        try {
            return "role";
            //todo this part will be deleted
        } catch (err) {
            throw err
        }
    }

    static getStatus(email) {
        if (!(email))
            throw ("please fill all the information");
        try {
            //todo this part will be deleted
            return "status"
        } catch (err) {
            throw err
        }
    }

    setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail) {
        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail);
        } catch (err) {
            throw err
        }
    }

    getFirstAvailableTime(participants, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    async cancelMeeting(meetingIdentifier) {
        if (!(meetingIdentifier))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            await user.cancelAMeeting(meetingIdentifier)
        } catch (err) {
            throw err
        }
    }

    editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        if (!(meetingIdentifier && title && descriptions && participants && startingTime && endingTime && purpose && office && whiteboard && projector))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            user.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector)
        } catch (err) {
            throw err
        }
    }

}

module.exports = Organizer