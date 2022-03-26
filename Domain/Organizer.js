const MeetingDataBase = require('../DataAccess/MeetingDataBase');

let instanceOfOrganizerDomain;

class OrganizerDomain {
    constructor() {
    }

    static getOrganizer() {
        if (instanceOfOrganizerDomain)
            return instanceOfOrganizerDomain;
        instanceOfOrganizerDomain = new OrganizerDomain();
        return instanceOfOrganizerDomain;
    }
/*
    static async getUserStatus(email){
        //todo get the data with proto

    }

    static async getUserRole(email){
        //todo get the data with proto
    }*/

    setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail) {
        //todo return meeting identifier
    }

    getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector) {
        //todo
    }

    async cancelAMeeting(meetingIdentifier) {
        try {
            await MeetingDataBase.changeStatusToCancelled(meetingIdentifier);
        }catch (err){
            throw err;
        }
    }

    editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
        //todo
    }
}

module.exports = OrganizerDomain