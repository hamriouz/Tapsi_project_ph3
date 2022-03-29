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

    async getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    async cancelMeeting(meetingIdentifier, email, role) {
        if (!(meetingIdentifier && email && role))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            await user.cancelAMeeting(meetingIdentifier, email, role)
        } catch (err) {
            throw err
        }
    }

    // async editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {
    //     try {
    //         const user = organizerDomain.getOrganizer();
    //         await user.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
    //     } catch (err) {
    //         throw err
    //     }
    // }
}

module.exports = Organizer