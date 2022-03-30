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