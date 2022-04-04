const {MeetingPurpose} = require("../Util/Enums/MeetingPurpose");
const DataAccess = require("../DataAccess/Meeting");
const {getID, isWantedRoomFree, cancelChosenMeeting, changeProjector} = require("../DataAccess/DataBaseManager/script");

const dataAccess = DataAccess.getInstance();

async function setMeetingWithFewParticipants(meetingInfo, id, isBeingEdited) {
    const {
        title,
        descriptions,
        participants,
        startingTime,
        endingTime,
        purpose,
        office,
        whiteboard,
        projector
    } = meetingInfo;
    let meetingIdentifier;
    let roomIdentifier;

    if (participants.length === 3) {
        let isBabolFree = isWantedRoomFree("Babol", office, startingTime, endingTime);
        let isAhvazFree = isWantedRoomFree("Ahvaz", office, startingTime, endingTime);
        let isIsfahanFree = isWantedRoomFree("Isfahan", office, startingTime, endingTime);
        let isRashtFree = isWantedRoomFree("Rasht", office, startingTime, endingTime);
        let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);

        if (isBabolFree)
            roomIdentifier = getRoomIdentifier("Babol", office);
        else if (isAhvazFree)
            roomIdentifier = getRoomIdentifier("Ahvaz", office);
        else if (isIsfahanFree)
            roomIdentifier = getRoomIdentifier("Isfahan", office);
        else if (isRashtFree)
            roomIdentifier = getRoomIdentifier("Rasht", office);
        else if (isKarajFree)
            roomIdentifier = getRoomIdentifier("Karaj", office);
        else roomIdentifier = reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector);

    } else if (participants.length === 4) {
        let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);
        if (isKarajFree)
            roomIdentifier = getRoomIdentifier("Karaj", office);
        else roomIdentifier = reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector);
    }

    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }
}

async function setMeetingWithManyParticipants(meetingInfo, id, isBeingEdited) {
    const {
        title,
        descriptions,
        participants,
        startingTime,
        endingTime,
        purpose,
        office,
        whiteboard,
        projector
    } = meetingInfo;
    let meetingIdentifier;
    let roomIdentifier;

    if (participants.length === 4) {
        let isBabolFree = isWantedRoomFree("Babol", office, startingTime, endingTime);
        let isShirazFree = isWantedRoomFree("Shiraz", office, startingTime, endingTime);
        let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);

        if (isBabolFree)
            roomIdentifier = getRoomIdentifier("Babol", office);
        else if (isShirazFree)
            roomIdentifier = getRoomIdentifier("Shiraz", office);
        else if (isMashhadFree)
            roomIdentifier = getRoomIdentifier("Mashhad", office);
        else roomIdentifier = reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector);

    } else if (participants.length === 5 || participants.length === 6) {
        let isShirazFree = isWantedRoomFree("Shiraz", office, startingTime, endingTime);
        let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);

        if (isShirazFree)
            roomIdentifier = getRoomIdentifier("Shiraz", office);
        else if (isMashhadFree)
            roomIdentifier = getRoomIdentifier("Mashhad", office);
        else roomIdentifier = reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector);

    } else if (participants.length > 6 && participants.length < 9) {
        let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);
        if (isMashhadFree)
            roomIdentifier = getRoomIdentifier("Mashhad", office);
        else roomIdentifier = reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector);
    }

    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }

}

async function setAMeetingInTehranRoom(meetingInfo, id, isBeingEdited) {
    const {startingTime, endingTime, office} = meetingInfo;
    let meetingIdentifier;
    let roomIdentifier;

    let isTehranFree = isWantedRoomFree("Tehran", office, startingTime, endingTime);
    if (isTehranFree)
        roomIdentifier = getRoomIdentifier("Tehran", office);

    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }
}

async function getSoonestTimeInSmallRooms(meetingInfo) {
    let {participants, specificDate, duration, office, projector} = meetingInfo;
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

        if (participants.length > 3) {
            if (isKarajFree)
                return specificDate;
        } else if (isBabolFree || isAhvazFree || isIsfahanFree || isRashtFree || isQomFree || isKarajFree) return specificDate;
        else {
            specificDate += (15 * 1000 * 60);
            endingSpecificTime += (15 * 1000 * 60);
        }
    }
}

async function getSoonestTimeInMediumRooms(meetingInfo) {
    let {participants, specificDate, duration, purpose, office, whiteboard, projector} = meetingInfo
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
}

async function getSoonestTimeInTehranRoom(meetingInfo) {
    let {participants, specificDate, duration, purpose, office, whiteboard, projector} = meetingInfo;
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
}

async function editTime(meetingIdentifier, startingTime, endingTime) {
    //todo check if it's in the participants working hour

    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    await cancelChosenMeeting(meetingIdentifier);
    if (!startingTime)
        startingTime = meeting.start;
    if (!endingTime)
        endingTime = meeting.end;
    await Meeting.setNewMeeting(meeting.title, meeting.description, meeting.participants, startingTime, endingTime, meeting.purpose, meeting.office, meeting.whiteboard, meeting.projector, meeting.organizer, true);

}

async function editParticipants(meetingIdentifier, oldParticipant, newParticipants) {
    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    const meetingCapacity = getMeetingRoomCapacity(meeting.roomIdentifier);
    if (oldParticipant.length === newParticipants.length ||
        newParticipants.length <= meetingCapacity) await dataAccess.changeParticipants(meetingIdentifier, newParticipants)
    else {
        try {
            await cancelChosenMeeting(meetingIdentifier);
            await Meeting.setNewMeeting(meeting.title, meeting.description, newParticipants, meeting.start, meeting.end, meeting.purpose, meeting.office, meeting.whiteboard, meeting.projector, meeting.organizer, true);
        } catch (err) {
            throw err;
        }
    }
}

async function editProjector(meetingIdentifier, projector) {
    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    if (meeting.participants.length === 3)
        throw 'unable to edit the chosen attribute'
    else await changeProjector(meetingIdentifier, projector);
}

function getMeetingRoomCapacity(meetingIdentifier) {
    let roomCapacity;
    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    const roomIdentifier = meeting[0].roomIdentifier;
    //todo get room capacity based on the room identifier
    return roomCapacity;
}

function getRoomIdentifier(roomName, office) {
    let roomIdentifier;
    //todo get room identifier based on the name and office
    return roomIdentifier;
}

function reorganize(participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
    //todo
}

class Meeting {
    constructor(meetingInfo, organizerId) {
        const {
            title,
            descriptions,
            participants,
            startingTime,
            endingTime,
            purpose,
            office,
            whiteboard,
            projector,
            roomIdentifier
        } = meetingInfo;
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
        // await dataAccess.createNewMeeting(meetingInfo, organizerId)

    }

    static async getMeetingByIdentifier(meetingIdentifier) {
        try {
            //todo
            const meetingData = await dataAccess.getMeetingByIdentifier(meetingIdentifier)
            return new Meeting(meetingData.title, meetingData.description, meetingData.participants, meetingData.startingTime, meetingData.endingTime, meetingData.purpose, meetingData.office, meetingData.whiteboard, meetingData.projector, meetingData.roomIdentifier, meetingData.organizerId)
        } catch (err) {
            throw err;
        }
    }

    static async setNewMeeting(meetingInfo, organizerId, isBeingEdited) {
        // async static setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId, isBeingEdited) {
        try {
            //todo check if it's in the participants working hour
            let meetingIdentifier;
            if (meetingInfo.purpose === MeetingPurpose.INTERVIEW ||
                meetingInfo.purpose === MeetingPurpose.PDCHAT) {
                // meetingIdentifier = setMeetingWithFewParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId, isBeingEdited)
                meetingIdentifier = setMeetingWithFewParticipants(meetingInfo, organizerId, isBeingEdited)
            } else if (meetingInfo.purpose === MeetingPurpose.SPECREVIEW ||
                meetingInfo.participants.length > 8) {
                meetingIdentifier = setAMeetingInTehranRoom(meetingInfo, organizerId, isBeingEdited)
                // meetingIdentifier = setAMeetingInTehranRoom(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId, isBeingEdited)
            } else if (meetingInfo.purpose === MeetingPurpose.SPRINTPLANNING ||
                meetingInfo.purpose === MeetingPurpose.GROOMING) {
                // meetingIdentifier = setMeetingWithManyParticipants(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId, isBeingEdited)
                meetingIdentifier = setMeetingWithManyParticipants(meetingInfo, organizerId, isBeingEdited)
            }
            return meetingIdentifier;
        } catch (err) {
            throw err
        }
    }

    static async getSoonestAvailableTime(meetingInfo) {
        // async static getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        try {
            let soonestAvailableTime;
            if (meetingInfo.purpose === MeetingPurpose.SPECREVIEW ||
                meetingInfo.participants.length > 8) {
                soonestAvailableTime = await getSoonestTimeInTehranRoom(meetingInfo);
                // soonestAvailableTime = await getSoonestTimeInTehranRoom(participants, specificDate, duration, purpose, office, whiteboard, projector);
            } else if (meetingInfo.purpose === MeetingPurpose.PDCHAT ||
                meetingInfo.purpose === MeetingPurpose.INTERVIEW) {
                soonestAvailableTime = await getSoonestTimeInSmallRooms(meetingInfo);
            }
            // meetingInfo.purpose === MeetingPurpose.INTERVIEW) soonestAvailableTime = await getSoonestTimeInSmallRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);
            else if (meetingInfo.purpose === MeetingPurpose.GROOMING ||
                meetingInfo.purpose === MeetingPurpose.SPRINTPLANNING) {
                soonestAvailableTime = await getSoonestTimeInMediumRooms(meetingInfo);
            }
            // meetingInfo.purpose === MeetingPurpose.SPRINTPLANNING) soonestAvailableTime = await getSoonestTimeInMediumRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);
            return soonestAvailableTime;
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

    async editAMeeting(meetingInfo, requestSenderId) {
        //todo check with participants' working hour
        let {
            meetingIdentifier,
            title,
            descriptions,
            newParticipants,
            startingTime,
            endingTime,
            purpose,
            office,
            whiteboard,
            projector
        } = meetingInfo;
        // async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, requestSenderId) {
        if (requestSenderId !== this.organizerId)
            throw "only the meeting organizer can edit a meeting"
        try {
            if (title) {
                this.title = title;
                await dataAccess.changeTitle(meetingIdentifier, meetingInfo.title)
            }
            if (descriptions) {
                this.description = descriptions;
                await dataAccess.changeDescription(meetingIdentifier, descriptions);
            }
            if (newParticipants) {
                await editParticipants(meetingIdentifier, this.participants, newParticipants);
                this.participants = newParticipants;
            }
            if (startingTime || endingTime) {
                await editTime(meetingIdentifier, startingTime, endingTime);
                if (startingTime)
                    this.startingTime = startingTime;
                if (endingTime)
                    this.endingTime = endingTime;
            }
            if (purpose) {
                await dataAccess.changePurpose(meetingIdentifier, purpose);
                this.purpose = purpose;
            }
            if (whiteboard !== undefined) {
                await dataAccess.changeWhiteBoard(meetingIdentifier, whiteboard);
            }
            if (projector !== undefined) {
                await editProjector(meetingIdentifier, projector);
                this.projector = projector;
            }
            if (office) {
                //todo ?!
                await Meeting.setNewMeeting(this.title, this.description, this.participants, this.startingTime, this.endingTime, this.purpose, office, this.whiteboard, this.projector, this.organizerId, true);
                await this.cancelAMeeting(meetingIdentifier, requestSenderId, "organizer");
            }
        } catch (err) {
            throw err;
        }
    }

    async getMeetingID() {
        return getID(this.startingTime, this.endingTime, this.office, this.roomIdentifier)
    }

    static async getMeetingInATimeSlot(startingTime, endingTime) {
        try {
            return await dataAccess.meetingsInTimeSlot(startingTime, endingTime)
        } catch (err) {
            throw err
        }
    }

    static async getMeetingInARoom(roomIdentifier, date) {
        try {
            return await dataAccess.meetingsInRoom(roomIdentifier, date)
        } catch (err) {
            throw err
        }
    }
}

module.exports = Meeting