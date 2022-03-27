// const MeetingDataBase = require('../DataAccess/MeetingDataBase');
const DataAccessOrganizer = require('../DataAccess/Organizer')
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

    async setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail) {
        let organizer = DataAccessOrganizer.getOrganizer();
        //todo find the suitable room, if it exists get the id and create the meeting and if it doesnt exist throw an exception
        if (/*room exists*/){
            let roomIdentifier;
            let organizerId;
            await organizer.createNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId)
            // organizer.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail)
        }
        //todo save the meeting with the organizer's id because of changeOffice
        //todo return meeting identifier
    }

    getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        //todo
    }

    async cancelAMeeting(meetingIdentifier, email) {
        try {
            //todo check if the user is the organizer or admin
            let organizer = DataAccessOrganizer.getOrganizer();
            await organizer.cancelChosenMeeting(meetingIdentifier)
        } catch (err) {
            throw err;
        }
    }

    async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, email) {
        //todo check if the user is the organizer of the meeting
        try {
            let organizer = DataAccessOrganizer.getOrganizer();
            if (title)
                await organizer.changeTitle(meetingIdentifier, title)
            if (descriptions)
                await organizer.changeDescription(meetingIdentifier, descriptions)
            if (newParticipants) {
                let meeting = organizer.getMeetingById(meetingIdentifier);
                if (meeting.participants.length === newParticipants.length) {
                    await organizer.changeParticipants(meetingIdentifier, newParticipants)
                    //todo get the room capacity and check if we need to change the room or not
                }else {
                    await organizer.cancelChosenMeeting(meetingIdentifier);
                    let cancelledMeeting = organizer.getMeetingById(meetingIdentifier);
                    //todo throw a proper exception when the meeting couldn't be re-allocated
                    this.setNewMeeting(
                        cancelledMeeting.title,
                        cancelledMeeting.description,
                        newParticipants,
                        cancelledMeeting.start,
                        cancelledMeeting.end,
                        cancelledMeeting.purpose,
                        cancelledMeeting.office,
                        cancelledMeeting.whiteboard,
                        cancelledMeeting.projector,
                        cancelledMeeting.organizer
                    );
                }
            }
            if (startingTime && endingTime) {
                //todo
            }
            if (startingTime) {
                //todo
            }
            if (endingTime) {
                //todo
            }
            if (purpose)
                await organizer.changePurpose(meetingIdentifier, purpose)
            if (office) {
                await organizer.cancelChosenMeeting(meetingIdentifier);
                let cancelledMeeting = organizer.getMeetingById(meetingIdentifier)
                this.setNewMeeting(
                    cancelledMeeting.title,
                    cancelledMeeting.description,
                    cancelledMeeting.participants,
                    cancelledMeeting.start,
                    cancelledMeeting.end,
                    cancelledMeeting.purpose,
                    office,
                    cancelledMeeting.whiteboard,
                    cancelledMeeting.projector,
                    cancelledMeeting.organizer
                );
            }
            if (whiteboard !== undefined)
                await organizer.changeWhiteBoard(meetingIdentifier, whiteboard)
            if (projector !== undefined)
                await organizer.changeProjector(meetingIdentifier, projector)
        } catch (err) {
            throw err;
        }

    }
}

module.exports = OrganizerDomain


/*
    static async getUserStatus(email){
        //todo get the data with proto

    }

    static async getUserRole(email){
        //todo get the data with proto
    }*/