const {MeetingPurpose} = require("../Util/Enums/MeetingPurpose");
const {
    setMeetingWithFewParticipants,
    setMeetingWithManyParticipants,
    setAMeetingInTehranRoom,
    getSoonestTimeInTehranRoom,
    getSoonestTimeInMediumRooms,
    getSoonestTimeInSmallRooms,
    editTime,
    editParticipants,
    editPurpose,
    editOffice,
    editProjector
} = require('./Functions')
const DataAccess = require("../DataAccess/Meeting");

const dataAccess = DataAccess.getInstance();

class Meeting {
    async constructor(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId) {
        this.title = title;
        this.description = descriptions;
        this.participants = participants;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.purpose = purpose;
        this.office = office;
        this.whiteboard = whiteboard;
        this.projector = projector;
        this.roomIdentifier = roomIdentifier;
        this.organizerId = organizerId;
        await dataAccess.createNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId)

    }

    static async getMeetingByIdentifier(meetingIdentifier) {
        try {
            return await dataAccess.getMeetingByIdentifier(meetingIdentifier)
        } catch (err) {
            throw err;
        }
    }

    async static setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {
        try {
            if (purpose === MeetingPurpose.INTERVIEW || purpose === MeetingPurpose.PDCHAT) setMeetingWithFewParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
            else if (purpose === MeetingPurpose.SPECREVIEW || participants.length > 8) setAMeetingInTehranRoom(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
            else if (purpose === MeetingPurpose.SPRINTPLANNING || purpose === MeetingPurpose.GROOMING) setMeetingWithManyParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
        } catch (err) {
            throw err
        }
    }

    async static getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        try {
            if (purpose === MeetingPurpose.SPECREVIEW || participants.length > 8) getSoonestTimeInTehranRoom(participants, specificDate, duration, purpose, office, whiteboard, projector);
            else if (purpose === MeetingPurpose.PDCHAT || purpose === MeetingPurpose.INTERVIEW) getSoonestTimeInSmallRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);
            else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING) getSoonestTimeInMediumRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    async cancelAMeeting(meetingIdentifier, organizerId, role) {
        try {
            if (this.organizerId === organizerId || role === "admin")
                await dataAccess.cancelChosenMeeting(meetingIdentifier);
            else throw "only the meeting organizer or an admin can cancel a meeting";

        } catch (err) {
            throw err;
        }
    }

    async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {
        if (id !== this.organizerId)
            throw "only the meeting organizer can edit a meeting"
        try {
            if (title) {
                this.title = title;
                await dataAccess.changeTitle(meetingIdentifier, title)
            }
            if (descriptions) {
                this.description = descriptions;
                await dataAccess.changeDescription(meetingIdentifier, descriptions)
            }
            if (newParticipants) {
                await editParticipants(meetingIdentifier, newParticipants)
                this.participants = newParticipants
            }
            if (startingTime || endingTime) {
                await editTime(meetingIdentifier, startingTime, endingTime);
                if (startingTime)
                    this.startingTime = startingTime;
                if (endingTime)
                    this.endingTime = endingTime
            }
            if (purpose) {
                await editPurpose(meetingIdentifier, purpose)
                this.purpose = purpose;
            }
            if (office)
                await editOffice(meetingIdentifier, office);

            if (whiteboard !== undefined) {
                await dataAccess.changeWhiteBoard(meetingIdentifier, whiteboard)
            }
            if (projector !== undefined) {
                await editProjector(meetingIdentifier, projector)
                this.projector = projector;
            }
        } catch (err) {
            throw err;
        }
    }

    async static getMeetingInATimeSlot(startingTime, endingTime) {
        try {
            return await dataAccess.meetingsInTimeSlot(startingTime, endingTime)
        } catch (err) {
            throw err
        }
    }

    async static getMeetingInARoom(roomIdentifier, date) {
        try {
            return await dataAccess.meetingsInRoom(roomIdentifier, date)
        } catch (err) {
            throw err
        }
    }
}

module.exports = Meeting