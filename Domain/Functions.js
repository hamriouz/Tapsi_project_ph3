const {isWantedRoomFree, cancelChosenMeeting, changeProjector} = require("../DataAccess/DataBaseManager/script");
const DataAccess = require('../DataAccess/Meeting');
const dataAccess = DataAccess.getInstance();
const Meeting = require('../Domain/Meeting');
const e = require("express");

module.exports = {
    async setMeetingWithFewParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id, isBeingEdited) {
        let meetingIdentifier;
        let roomIdentifier;

        if (participants.length === 3) {
            let isBabolFree = isWantedRoomFree("Babol", office, startingTime, endingTime);
            let isAhvazFree = isWantedRoomFree("Ahvaz", office, startingTime, endingTime);
            let isIsfahanFree = isWantedRoomFree("Isfahan", office, startingTime, endingTime);
            let isRashtFree = isWantedRoomFree("Rasht", office, startingTime, endingTime);
            let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);

            if (isBabolFree)
                roomIdentifier = this.getRoomIdentifier("Babol", office);
            else if (isAhvazFree)
                roomIdentifier = this.getRoomIdentifier("Ahvaz", office);
            else if (isIsfahanFree)
                roomIdentifier = this.getRoomIdentifier("Isfahan", office);
            else if (isRashtFree)
                roomIdentifier = this.getRoomIdentifier("Rasht", office);
            else if (isKarajFree)
                roomIdentifier = this.getRoomIdentifier("Karaj", office);
            else roomIdentifier = this.reorganize();
        } else if (participants.length === 4) {
            let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);
            if (isKarajFree)
                roomIdentifier = this.getRoomIdentifier("Karaj", office);
            else roomIdentifier = this.reorganize();
        }

        if (roomIdentifier) {
            let meeting = new Meeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, id);
            meetingIdentifier = await meeting.getMeetingID();
            return meetingIdentifier;
        } else {
            if (isBeingEdited)
                throw 'unable to edit the chosen attribute'
            else throw 'no room found in the given period of time for the wanted office'
        }
    },

    async setMeetingWithManyParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id, isBeingEdited) {
        let meetingIdentifier;
        let roomIdentifier;

        if (participants.length === 4) {
            let isBabolFree = isWantedRoomFree("Babol", office, startingTime, endingTime);
            let isShirazFree = isWantedRoomFree("Shiraz", office, startingTime, endingTime);
            let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);

            if (isBabolFree)
                roomIdentifier = this.getRoomIdentifier("Babol", office);
            else if (isShirazFree)
                roomIdentifier = this.getRoomIdentifier("Shiraz", office);
            else if (isMashhadFree)
                roomIdentifier = this.getRoomIdentifier("Mashhad", office);
            else roomIdentifier = this.reorganize();

        } else if (participants.length === 5 || participants.length === 6) {
            let isShirazFree = isWantedRoomFree("Shiraz", office, startingTime, endingTime);
            let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);

            if (isShirazFree)
                roomIdentifier = this.getRoomIdentifier("Shiraz", office);
            else if (isMashhadFree)
                roomIdentifier = this.getRoomIdentifier("Mashhad", office);
            else roomIdentifier = this.reorganize();

        } else if (participants.length > 6 && participants.length < 9) {
            let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);
            if (isMashhadFree)
                roomIdentifier = this.getRoomIdentifier("Mashhad", office);
            else roomIdentifier = this.reorganize();
        }

        if (roomIdentifier) {
            let meeting = new Meeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, id);
            meetingIdentifier = await meeting.getMeetingID();
            return meetingIdentifier;
        } else {
            if (isBeingEdited)
                throw 'unable to edit the chosen attribute'
            else throw 'no room found in the given period of time for the wanted office'
        }

    },

    async setAMeetingInTehranRoom(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id, isBeingEdited) {
        let meetingIdentifier;
        let roomIdentifier;

        let isTehranFree = isWantedRoomFree("Tehran", office, startingTime, endingTime);
        if (isTehranFree)
            roomIdentifier = this.getRoomIdentifier("Tehran", office);

        if (roomIdentifier) {
            let meeting = new Meeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, id);
            meetingIdentifier = await meeting.getMeetingID();
            return meetingIdentifier;
        } else {
            if (isBeingEdited)
                throw 'unable to edit the chosen attribute'
            else throw 'no room found in the given period of time for the wanted office'
        }
    },

    async getSoonestTimeInSmallRooms(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (projector === true)
            throw 'there are no small rooms with the projector feature'
        if (!specificDate) {
            const d = new Date();
            specificDate = d.getTime();
        }
        let endingSpecificTime = specificDate + duration
        while (true) {
            let isBabolFree = await isWantedRoomFree("Babol", office, specificDate, endingSpecificTime);
            let isAhvazFree = await isWantedRoomFree("Ahvaz", office, specificDate, endingSpecificTime);
            let isIsfahanFree = await isWantedRoomFree("Isfahan", office, specificDate, endingSpecificTime);
            let isRashtFree = await isWantedRoomFree("Rasht", office, specificDate, endingSpecificTime);
            let isQomFree = await isWantedRoomFree("Qom", office, specificDate, endingSpecificTime);
            let isKarajFree = await isWantedRoomFree("Karaj", office, specificDate, endingSpecificTime);
            if (participants.length > 3)
                if (isKarajFree)
                    return specificDate;
                else if (isBabolFree || isAhvazFree || isIsfahanFree || isRashtFree || isQomFree || isKarajFree) return specificDate;
                else {
                    specificDate += (15 * 1000 * 60);
                    endingSpecificTime += (15 * 1000 * 60);
                }
        }
    },

    async getSoonestTimeInMediumRooms(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!specificDate) {
            const d = new Date();
            specificDate = d.getTime();
        }
        let numberOfParticipants = participants.length;
        let endSpecificDate = specificDate + duration;
        while (true) {
            let isKarajFree = await isWantedRoomFree("Karaj", office, specificDate, endSpecificDate);
            let isShirazFree = await isWantedRoomFree("Shiraz", office, specificDate, endSpecificDate);
            let isMashhadFree = await isWantedRoomFree("Mashhad", office, specificDate, endSpecificDate);
            switch (numberOfParticipants) {
                case 4:
                    if (isKarajFree)
                        return specificDate;
                case 5:
                case 6:
                case 7:
                    if (isShirazFree)
                        return specificDate;
                case 8:
                    if (isMashhadFree)
                        return specificDate;
                    break;
            }
            specificDate += (15 * 1000 * 60);
            endSpecificDate += (15 * 1000 * 60);
        }
    },

    async getSoonestTimeInTehranRoom(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!specificDate) {
            const d = new Date();
            specificDate = d.getTime();
        }
        let endSpecificDate = specificDate + duration;
        while (true) {
            let isTehranFree = await isWantedRoomFree("Tehran", office, specificDate, endSpecificDate);
            if (isTehranFree) return specificDate;
            else {
                specificDate += (15 * 1000 * 60);
                endSpecificDate += (15 * 1000 * 60);
            }
        }
    },

    async editTime(meetingIdentifier, startingTime, endingTime) {
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        await cancelChosenMeeting(meetingIdentifier);
        if (!startingTime)
            startingTime = meeting.start;
        if (!endingTime)
            endingTime = meeting.end;
        await Meeting.setNewMeeting(meeting.title, meeting.description, meeting.participants, startingTime, endingTime, meeting.purpose, meeting.office, meeting.whiteboard, meeting.projector, meeting.organizer, true);

    },

    async editParticipants(meetingIdentifier, oldParticipant, newParticipants) {
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        const meetingCapacity = this.getMeetingRoomCapacity(meeting.roomIdentifier);
        if (oldParticipant.length === newParticipants.length || newParticipants.length <= meetingCapacity) await dataAccess.changeParticipants(meetingIdentifier, newParticipants)
        else {
            try {
                await cancelChosenMeeting(meetingIdentifier);
                await Meeting.setNewMeeting(meeting.title, meeting.description, newParticipants, meeting.start, meeting.end, meeting.purpose, meeting.office, meeting.whiteboard, meeting.projector, meeting.organizer, true);
            } catch (err) {
                throw err;
            }
        }
    },

    async editProjector(meetingIdentifier, projector) {
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        if (meeting.participants.length === 3)
            throw 'unable to edit the chosen attribute'
        else await changeProjector(meetingIdentifier, projector);
    },

    getMeetingRoomCapacity(meetingIdentifier) {
        let roomCapacity;
        //todo
        return roomCapacity;
    },

    getRoomIdentifier(roomName, office) {
        let roomIdentifier;
        //todo
        return roomIdentifier;
    },

    reorganize() {
        //todo
    }


}


/*    async static setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId) {
        try {
            let organizer = meetingDataAccess.getOrganizer();
            let freeRoom;
            let meetingIdentifier;
            if (purpose === MeetingPurpose.INTERVIEW || purpose === MeetingPurpose.PDCHAT) {
                Meeting.checkProjector(projector);
                freeRoom = await Meeting.setPDChatOrInterview(organizer, startingTime, endingTime, office);
            } else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING) {
                if (participants.length > 8)
                    freeRoom = await Meeting.setTehran(organizer, startingTime, endingTime, office);
                else
                    freeRoom = await Meeting.setGroomingOrSprint(organizer, startingTime, endingTime, office, participants);
            } else if (purpose === MeetingPurpose.SPECREVIEW)
                freeRoom = await Meeting.setTehran(organizer, startingTime, endingTime, office)

            if (freeRoom) {
                meetingIdentifier = Meeting.setTheMeetingWithRoomID(organizer, freeRoom, office, organizerId, title, descriptions, participants, startingTime, endingTime, purpose, whiteboard, projector)
                return meetingIdentifier;
            } else throw "No free room could be found"
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

    static checkProjector(projector) {
        if (projector === true)
            throw "Meetings with less than 4 participants cant be held in rooms that have the projector feature."
    }

    reassignRooms() {
        //return "" if no room...
    }

    async setTheMeetingWithRoomID(organizer, freeRoom, office, organizerId, title, descriptions, participants, startingTime, endingTime, purpose, whiteboard, projector) {
        let roomIdentifier = this.getRoomIdentifier(freeRoom, office);
        // let organizerId = this.getOrganizerID(organizerEmail);
        let meetingIdentifier = await organizer.createNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, roomIdentifier, organizerId)
        return meetingIdentifier;
    }

    static getRoomIdentifier(roomName, office) {
        let organizer = meetingDataAccess.getOrganizer();
        let roomIdentifier = organizer.getRoomIdentifierWithNameOffice(roomName, office);
        return roomIdentifier;
    }
*/


/*

        async cancelAMeeting(meetingIdentifier, organizerId, role) {
        try {
            let organizer = meetingDataAccess.getOrganizer();
            // let organizerIdentifier = this.getOrganizerID(organizerId);
            let meeting = organizer.getMeetingById(meetingIdentifier);
            if (organizerId === meeting.organizer || role === "admin")
                await organizer.cancelChosenMeeting(meetingIdentifier)
            else throw "only the meeting organizer or an admin can cancel a meeting"
        } catch (err) {
            throw err;
        }
    }

    async static getMeetingInATimeSlot(startingTime, endingTime) {
        try {
            const admin = dataAccess.getAdmin();
            return await admin.meetingsInTimeSlot(startingTime, endingTime)
        } catch (err) {
            throw err
        }
    }

    async static getMeetingInARoom(roomIdentifier, date) {
        try {
            const admin = dataAccess.getAdmin();
            return await admin.meetingsInRoom(roomIdentifier, date)
        } catch (err) {
            throw err
        }



        async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerIdentifier) {
        let mee = meetingDataAccess.getOrganizer();
        // let organizerIdentifier = this.getOrganizerID(email);
        let meeting = organizer.getMeetingById(meetingIdentifier);
        if (organizerIdentifier !== meeting.organizer)
            throw "only the meeting organizer can edit a meeting"
        try {
            let organizer = meetingDataAccess.getOrganizer();
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
        }
        if (startingTime) {

        }
        if (endingTime) {
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
        } else {
            await organizer.cancelChosenMeeting(meetingIdentifier);
            let cancelledMeeting = organizer.getMeetingById(meetingIdentifier);
            await this.setNewMeeting(cancelledMeeting.title, cancelledMeeting.description, newParticipants, cancelledMeeting.start, cancelledMeeting.end, cancelledMeeting.purpose, cancelledMeeting.office, cancelledMeeting.whiteboard, cancelledMeeting.projector, cancelledMeeting.organizer
            );
        }
    }
    }*/