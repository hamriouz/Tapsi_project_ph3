// const MeetingDataBase = require('../DataAccess/MeetingDataBase');
const DataAccessOrganizer = require('../DataAccess/Organizer');
const getPurpose = require('../Enums/MeetingPurpose')
const {MeetingPurpose} = require("../Enums/MeetingPurpose");
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
        try {
            let organizer = DataAccessOrganizer.getOrganizer();
            let freeRoom;
            if (purpose === MeetingPurpose.INTERVIEW || purpose === MeetingPurpose.PDCHAT) {
                this.checkProjector(projector);
               freeRoom  = await this.setPDChatOrInterview(organizer, startingTime, endingTime, office);
            } else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING) {
                if (participants.length > 8)
                    freeRoom = await this.setTehran(organizer, startingTime, endingTime, office);
                else
                    freeRoom = await this.setGroomingOrSprint(organizer, startingTime, endingTime, office, participants);
            } else if (purpose === MeetingPurpose.SPECREVIEW) {
                freeRoom = await this.setTehran(organizer, startingTime, endingTime, office)
            }
            if (freeRoom){
                //todo get room id and organizer id
                let roomIdentifier;
                let organizerId;
                let meetingIdentifier = await organizer.createNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId)
                return meetingIdentifier;
            }else {
            //todo reassign the rooms
                }
        }
         catch (err) {
            throw err;
        }
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
                    //todo cancel the meeting if re-allocation couldnt be done
                } else {
                    await organizer.cancelChosenMeeting(meetingIdentifier);
                    let cancelledMeeting = organizer.getMeetingById(meetingIdentifier);
                    //todo throw a proper exception when the meeting couldn't be re-allocated
                    await this.setNewMeeting(cancelledMeeting.title, cancelledMeeting.description, newParticipants, cancelledMeeting.start, cancelledMeeting.end, cancelledMeeting.purpose, cancelledMeeting.office, cancelledMeeting.whiteboard, cancelledMeeting.projector, cancelledMeeting.organizer
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
            if (purpose) {
                purpose = getPurpose(purpose);
                await organizer.changePurpose(meetingIdentifier, purpose)
            }
            if (office) {
                await organizer.cancelChosenMeeting(meetingIdentifier);
                let cancelledMeeting = organizer.getMeetingById(meetingIdentifier)
                await this.setNewMeeting(cancelledMeeting.title, cancelledMeeting.description, cancelledMeeting.participants, cancelledMeeting.start, cancelledMeeting.end, cancelledMeeting.purpose, office, cancelledMeeting.whiteboard, cancelledMeeting.projector, cancelledMeeting.organizer);
            }
            if (whiteboard !== undefined)
                await organizer.changeWhiteBoard(meetingIdentifier, whiteboard)
            if (projector !== undefined)
                await organizer.changeProjector(meetingIdentifier, projector)
        } catch (err) {
            throw err;
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
                        } else throw "No free room could be found"
                    }
                }
            }
        }
    }

    async setTehran(organizer, startingTime, endingTime, office) {
        let isTehranFree = organizer.isRoomFree("Tehran", office, startingTime, endingTime);
        if (isTehranFree)
            return "Tehran"
        else throw "No free room could be found"
    }

    async setGroomingOrSprint(organizer, startingTime, endingTime, office, participants) {
        //todo throw exception if no room could be found
        //if 4 -> karaj shiraz mashhad
        //if 5 or 6 shiraz mashhad
        //if 7 or more mashhad
    }

    checkProjector(projector) {
        if (projector === true)
            throw "Meetings with less than 4 participants cant be held in rooms that have the projector feature."
    }
}

module.exports = OrganizerDomain