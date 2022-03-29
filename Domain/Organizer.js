/*
const DataAccessOrganizer = require('../DataAccess/Organizer');
const {MeetingPurpose} = require("../Util/Enums/MeetingPurpose");
const {cancelChosenMeeting} = require("../DataAccess/DataBaseManager/script");
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

    async setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId) {
        try {
            let organizer = DataAccessOrganizer.getOrganizer();
            let freeRoom;
            let meetingIdentifier;
            if (purpose === MeetingPurpose.INTERVIEW || purpose === MeetingPurpose.PDCHAT) {
                this.checkProjector(projector);
                freeRoom = await this.setPDChatOrInterview(organizer, startingTime, endingTime, office);
            } else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING) {
                if (participants.length > 8)
                    freeRoom = await this.setTehran(organizer, startingTime, endingTime, office);
                else
                    freeRoom = await this.setGroomingOrSprint(organizer, startingTime, endingTime, office, participants);
            } else if (purpose === MeetingPurpose.SPECREVIEW)
                freeRoom = await this.setTehran(organizer, startingTime, endingTime, office)

            if (freeRoom) {
                meetingIdentifier = this.setTheMeetingWithRoomID(organizer, freeRoom, office, organizerId, title, descriptions, participants, startingTime, endingTime, purpose, whiteboard, projector)
                return meetingIdentifier;
            } else throw "No free room could be found"
        } catch (err) {
            throw err;
        }
    }

    getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (purpose === MeetingPurpose.SPECREVIEW || participants.length > 8){

        }
        else if (purpose === MeetingPurpose.PDCHAT || purpose === MeetingPurpose.INTERVIEW){
            let numberOfParticipants = participants.length;
            switch (numberOfParticipants) {
                case 4:
                    //Karaj
                    //todo
                case 5:
                case 6:
                case 7:
                    //Shiraz
                    //todo
                case 8:
                    //Mashhad
                    //todo
                    break;
            }

        }
        else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING){

        }
    }

    async cancelAMeeting(meetingIdentifier, organizerId, role) {
        try {
            let organizer = DataAccessOrganizer.getOrganizer();
            // let organizerIdentifier = this.getOrganizerID(organizerId);
            let meeting = organizer.getMeetingById(meetingIdentifier);
            if (organizerId === meeting.organizer || role === "admin")
                await organizer.cancelChosenMeeting(meetingIdentifier)
            else throw "only the meeting organizer or an admin can cancel a meeting"
        } catch (err) {
            throw err;
        }
    }

    async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerIdentifier) {
        let organizer = DataAccessOrganizer.getOrganizer();
        // let organizerIdentifier = this.getOrganizerID(email);
        let meeting = organizer.getMeetingById(meetingIdentifier);
        if (organizerIdentifier !== meeting.organizer)
            throw "only the meeting organizer can edit a meeting"
            try {
                let organizer = DataAccessOrganizer.getOrganizer();
                if (title)
                    await organizer.changeTitle(meetingIdentifier, title)
                if (descriptions)
                    await organizer.changeDescription(meetingIdentifier, descriptions)
                if (newParticipants)
                    await this.editParticipants(organizer, meetingIdentifier, newParticipants)
                if (startingTime || endingTime)
                    await this.editTime(organizer, meetingIdentifier, startingTime, endingTime);
                if (purpose)
                    await organizer.changePurpose(meetingIdentifier, purpose)
                if (office)
                    await this.editOffice(organizer, meetingIdentifier, office)
                if (whiteboard !== undefined)
                    await organizer.changeWhiteBoard(meetingIdentifier, whiteboard)
                if (projector !== undefined)
                    await organizer.changeProjector(meetingIdentifier, projector)
            } catch (err) {
                throw err;
            }
    }

    async editTime(organizer, meetingIdentifier, startingTime, endingTime) {
        await cancelChosenMeeting(meetingIdentifier);
        if (startingTime && endingTime) {
            //todo
        }
        if (startingTime) {

        }
        if (endingTime) {
            //todo
        }
    }

    async editOffice(organizer, meetingIdentifier, office) {
        await organizer.cancelChosenMeeting(meetingIdentifier);
        let cancelledMeeting = organizer.getMeetingById(meetingIdentifier)
        await this.setNewMeeting(cancelledMeeting.title, cancelledMeeting.description, cancelledMeeting.participants, cancelledMeeting.start, cancelledMeeting.end, cancelledMeeting.purpose, office, cancelledMeeting.whiteboard, cancelledMeeting.projector, cancelledMeeting.organizer);
    }

    async editParticipants(organizer, meetingIdentifier, newParticipants) {
        let meeting = organizer.getMeetingById(meetingIdentifier);
        if (meeting.participants.length === newParticipants.length) {
            await organizer.changeParticipants(meetingIdentifier, newParticipants)
            //todo get the room capacity and check if we need to change the room or not
            //todo cancel the meeting if re-allocation couldn't be done
        } else {
            await organizer.cancelChosenMeeting(meetingIdentifier);
            let cancelledMeeting = organizer.getMeetingById(meetingIdentifier);
            //todo throw a proper exception when the meeting couldn't be re-allocated
            await this.setNewMeeting(cancelledMeeting.title, cancelledMeeting.description, newParticipants, cancelledMeeting.start, cancelledMeeting.end, cancelledMeeting.purpose, cancelledMeeting.office, cancelledMeeting.whiteboard, cancelledMeeting.projector, cancelledMeeting.organizer
            );
        }
    }

    async setPDChatOrInterview(organizer, startingTime, endingTime, office) {
        let isQomFree = organizer.isRoomFree("Qom", office, startingTime, endingTime);
        if (isQomFree)
            return "Qom";
        else {
            let isRashtFree = organizer.isRoomFree("Rasht", office, startingTime, endingTime);
            if (isRashtFree) {
                return "Rasht";
            } else {
                let isIsfahanFree = organizer.isRoomFree("Isfahan", office, startingTime, endingTime);
                if (isIsfahanFree) {
                    return "Isfahan"
                } else {
                    let isAhvazFree = organizer.isRoomFree("Ahvaz", office, startingTime, endingTime);
                    if (isAhvazFree) {
                        return "Ahvaz"
                    } else {
                        let isBabolFree = organizer.isRoomFree("Qom", office, startingTime, endingTime);
                        if (isBabolFree) {
                            return "Babol"
                        }
                        return this.reassignRooms();
                    }
                }
            }
        }
    }

    async setGroomingOrSprint(organizer, startingTime, endingTime, office, participants) {
        let isKarajFree = organizer.isRoomFree("Karaj", office, startingTime, endingTime);
        let isShirazFree = organizer.isRoomFree("Shiraz", office, startingTime, endingTime);
        let isMashhadFree = organizer.isRoomFree("Mashhad", office, startingTime, endingTime);

        if (participants.length === 4) {
            if (isKarajFree)
                return "Karaj"
            else if (isShirazFree)
                return "Shiraz"
            else if (isMashhadFree)
                return "Mashhad"
            else return this.reassignRooms();
        }
        if (participants.length === 5 || participants.length === 6) {
            if (isShirazFree)
                return "Shiraz"
            else if (isMashhadFree)
                return "Mashhad"
            else return this.reassignRooms();
        }
        if (isMashhadFree)
            return "Mashhad"
        else return this.reassignRooms();
    }

    async setTehran(organizer, startingTime, endingTime, office) {
        let isTehranFree = organizer.isRoomFree("Tehran", office, startingTime, endingTime);
        if (isTehranFree)
            return "Tehran"
        return ""
    }

    checkProjector(projector) {
        if (projector === true)
            throw "Meetings with less than 4 participants cant be held in rooms that have the projector feature."
    }

    reassignRooms() {
        //return "" if no room...
        //todo
    }

    async setTheMeetingWithRoomID(organizer, freeRoom, office, organizerId, title, descriptions, participants, startingTime, endingTime, purpose, whiteboard, projector) {
        let roomIdentifier = this.getRoomIdentifier(freeRoom, office);
        // let organizerId = this.getOrganizerID(organizerEmail);
        let meetingIdentifier = await organizer.createNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId)
        return meetingIdentifier;
    }

    getRoomIdentifier(roomName, office) {
        let organizer = DataAccessOrganizer.getOrganizer();
        let roomIdentifier = organizer.getRoomIdentifierWithNameOffice(roomName, office);
        return roomIdentifier;
    }

    // async getOrganizerID(email) {
    //     let organizer = DataAccessOrganizer.getOrganizer();
    //     let userId = await organizer.getUserIdWithEmail(email);
    //     return userId;
    //
    // }
}

module.exports = OrganizerDomain*/
