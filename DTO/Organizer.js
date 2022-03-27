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

    setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail) {

        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail);
        } catch (err) {
            throw err
        }
    }

    getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    async cancelMeeting(meetingIdentifier, email) {
        if (!(meetingIdentifier && email))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            await user.cancelAMeeting(meetingIdentifier, email)
        } catch (err) {
            throw err
        }
    }

    async editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, email) {
        try {
            const user = organizerDomain.getOrganizer();
            await user.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, email)
        } catch (err) {
            throw err
        }
    }

}

module.exports = Organizer