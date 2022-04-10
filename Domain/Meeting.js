const {MeetingPurpose} = require("../Util/Enums/MeetingPurpose");
const DataAccess = require("../DataAccess/Meeting");
const roomClient = require('../gRPC/client/roomClient');
const userClient = require('../gRPC/client/userClient');

const {
    getID,
    isWantedRoomFree,
    cancelChosenMeeting,
    changeProjector,
    getListAllMeetingInTimeSlot
} = require("../DataAccess/DataBaseManager/script");

const dataAccess = DataAccess.getInstance();

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
    }

    static async getMeetingByIdentifier(meetingIdentifier) {
        try {
            const meetingData = await dataAccess.getMeetingByIdentifier(meetingIdentifier)
            return new Meeting(meetingData, meetingData.organizerId)
        } catch (err) {
            throw err;
        }
    }

    static async setNewMeeting(meetingInfo, organizerId, isBeingEdited) {
        try {
            isInParticipantsWorkingHour(meetingInfo.participants, meetingInfo.startingTime, meetingInfo.endingTime)
            return setMeeting(meetingInfo, organizerId, isBeingEdited);
        } catch (err) {
            throw err
        }
    }

    static async getSoonestAvailableTime(meetingInfo) {
        try {
             return await getSoonestTime(meetingInfo);
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
                isInParticipantsWorkingHour(newParticipants, this.startingTime, this.endingTime);
                await editParticipants(meetingIdentifier, this.participants, newParticipants);
                this.participants = newParticipants;
            }
            if (startingTime || endingTime) {
                if (!startingTime)
                    startingTime = this.startingTime;
                if (!endingTime)
                    endingTime = this.endingTime;
                isInParticipantsWorkingHour(this.participants, startingTime, endingTime);
                await editTime(meetingIdentifier, startingTime, endingTime);
                if (startingTime !== this.startingTime)
                    this.startingTime = startingTime;
                if (endingTime !== this.endingTime)
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
                let changedData = changeOffice(this, office);
                await Meeting.setNewMeeting(changedData, this.organizerId, true);
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

async function setMeeting(meetingInfo, id, isBeingEdited) {
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
    let allRooms = await roomClient.getAllRoomsInOffice(office);
    let smallRooms = getRoomsWithRequirements(participants, whiteboard, projector, allRooms);

    smallRooms.sort((first, second) => first.capacity - second.capacity);
    for (let i = 0; i < smallRooms.length; i++) {
        let isRoomFree = isWantedRoomFree(smallRooms[i].name, office, startingTime, endingTime)
        if (isRoomFree) {
            roomIdentifier = await getRoomIdentifier(smallRooms[i].name, office);
            break;
        }
    }
    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        await dataAccess.createNewMeeting(meetingInfo, id)
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }
}

function getRoomsWithRequirements(participants, whiteBoard, projector, allRooms) {
    let possibleRooms = [];
    if (whiteBoard === true) {
        for (let i = 0; i < allRooms.length; i++) {
            if (allRooms.whiteboard === true)
                possibleRooms.push(allRooms[i])
        }
    } else possibleRooms = allRooms;
    let roomsWithAllRequirements = [];
    if (projector === true) {
        possibleRooms.forEach(room => {
            if (room.projector === true)
                roomsWithAllRequirements.push(room);
        })
    } else roomsWithAllRequirements = possibleRooms;

    let finalRooms = [];

    if (participants.length < 5) {
        roomsWithAllRequirements.forEach(room => {
            if (room.capacity <= 5 &&
                participants.length <= room.capacity)
                finalRooms.push(room);
        })
    } else if (participants.length > 4 && participants.length < 9) {
        roomsWithAllRequirements.forEach(room => {
            if (room.capacity >= 5 && room.capacity <= 9 &&
                participants.length <= room.capacity)
                finalRooms.push(room);
        })
    } else if (participants.length > 8) {
        roomsWithAllRequirements.forEach(room => {
            if (room.capacity > 8 &&
                participants.length <= room.capacity)
                finalRooms.push(room);
        })
    }
    return finalRooms;
}

async function getSoonestTime(meetingInfo) {
    let {participants, specificDate, duration, office, projector, whiteboard} = meetingInfo;

    let allRooms = await roomClient.getAllRoomsInOffice(office);
    let roomsWithRequirements = getRoomsWithRequirements(participants, whiteboard, projector, allRooms);
    roomsWithRequirements.sort((first, second) => first.capacity - second.capacity);

    if (!specificDate) {
        const d = new Date();
        specificDate = d.getTime();
    }

    let endingSpecificTime = specificDate + duration
    let isDateOK = false;
    while (true) {
        roomsWithRequirements.forEach(room =>{
            if (isWantedRoomFree(room.name, office, specificDate, endingSpecificTime)){
                isDateOK = true;
                break;
            }
        })
        if (isDateOK) {
            return specificDate;
        } else {
            specificDate += (15 * 1000 * 60);
            endingSpecificTime += (15 * 1000 * 60);
        }
    }
}

async function editTime(meetingIdentifier, startingTime, endingTime) {
    try {
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        await cancelChosenMeeting(meetingIdentifier);
        if (!startingTime)
            startingTime = meeting.start;
        if (!endingTime)
            endingTime = meeting.end;
        let newData = changeTime(meeting, startingTime, endingTime);
        await Meeting.setNewMeeting(newData, meeting.organizer, true);
    } catch (err) {
        throw err;
    }

}

async function editParticipants(meetingIdentifier, oldParticipant, newParticipants) {
    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    const meetingCapacity = await getMeetingRoomCapacity(meeting.roomIdentifier);
    if (oldParticipant.length === newParticipants.length ||
        newParticipants.length <= meetingCapacity)
        await dataAccess.changeParticipants(meetingIdentifier, newParticipants)
    else {
        try {
            await cancelChosenMeeting(meetingIdentifier);
            let newData = changeParticipants(meeting, newParticipants);
            await Meeting.setNewMeeting(newData, meeting.organizer, true);
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

async function getMeetingRoomCapacity(meetingIdentifier) {
    let roomCapacity;
    const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
    const roomIdentifier = meeting.roomIdentifier;
    roomCapacity = await roomClient.getRoomCapacity(roomIdentifier);
    return roomCapacity;
}

async function getRoomIdentifier(roomName, office) {
    return await roomClient.getRoomIdentifier(office, roomName);
}

function isInParticipantsWorkingHour(participants, startingTime, endingTime) {
    participants.forEach(participant => {
        let workingHour = userClient.getUserWorkingHour(participant);
        let fields = workingHour.split('-');
        let startWorkingHour = fields[0];
        let endWorkingHour = fields[1];
        if (!(startWorkingHour <= startingTime && endWorkingHour >= endingTime))
            throw "The meeting is not in participant(s) working hour! Please change the meeting's time!"
    })
}

function changeOffice(meeting, newOffice) {
    return {
        "title": meeting.title,
        "descriptions": meeting.descriptions,
        "participants": meeting.participants,
        "startingTime": meeting.startingTime,
        "endingTime": meeting.endingTime,
        "purpose": meeting.purpose,
        "office": newOffice,
        "whiteboard": meeting.whiteboard,
        "projector": meeting.projector,
        "roomIdentifier": meeting.roomIdentifier,
        "organizerId": meeting.organizerId
    }
}

function changeTime(meeting, newStartingTime, newEndingTime) {
    return {
        "title": meeting.title,
        "descriptions": meeting.descriptions,
        "participants": meeting.participants,
        "startingTime": newStartingTime,
        "endingTime": newEndingTime,
        "purpose": meeting.purpose,
        "office": meeting.office,
        "whiteboard": meeting.whiteboard,
        "projector": meeting.projector,
        "roomIdentifier": meeting.roomIdentifier,
        "organizerId": meeting.organizerId
    }
}

function changeParticipants(meeting, participants) {
    return {
        "title": meeting.title,
        "descriptions": meeting.descriptions,
        "participants": participants,
        "startingTime": meeting.startingTime,
        "endingTime": meeting.endingTime,
        "purpose": meeting.purpose,
        "office": meeting.office,
        "whiteboard": meeting.whiteboard,
        "projector": meeting.projector,
        "roomIdentifier": meeting.roomIdentifier,
        "organizerId": meeting.organizerId
    }
}


module.exports = Meeting


/*
function set2(participants, startingTime, endingTime, purpose, office, whiteboard, projector) {
    let roomIdentifier;
    let meetingsInTimeSlot = Meeting.getMeetingInATimeSlot(startingTime, endingTime);
    if (purpose === MeetingPurpose.PDCHAT || purpose === MeetingPurpose.INTERVIEW) {

        if (participants.length === 4){
            for(let meeting in meetingsInTimeSlot){
                if (meeting["office"] === office && meeting["roomIdentifier"] === getRoomIdentifier("Karaj", office)){
                    if (meeting["participants"].length === 3){

                    }
                }
            }
        }
    }
    else if (purpose === MeetingPurpose.GROOMING || purpose === MeetingPurpose.SPRINTPLANNING){

    }
    else if (purpose === MeetingPurpose.SPECREVIEW){

    }
    return roomIdentifier;
}


// async static setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerId, isBeingEdited) {
// async static getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
// async editAMeeting(meetingIdentifier, title, descriptions, newParticipants, startingTime, endingTime, purpose, office, whiteboard, projector, requestSenderId) {
//toye set meeting ha reorganize


//todo
/!*

//  todo
// async function setMeeting(meetingInfo, id, isBeingEdited) {
//     const {title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector} = meetingInfo;
//     let meetingIdentifier;
//     let roomIdentifier;
//
//     if (participants.length === 3) {
//         let isBabolFree = isWantedRoomFree("Babol", office, startingTime, endingTime);
//         let isAhvazFree = isWantedRoomFree("Ahvaz", office, startingTime, endingTime);
//         let isIsfahanFree = isWantedRoomFree("Isfahan", office, startingTime, endingTime);
//         let isRashtFree = isWantedRoomFree("Rasht", office, startingTime, endingTime);
//         let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);
//
//         if (isBabolFree)
//             roomIdentifier = await getRoomIdentifier("Babol", office);
//         else if (isAhvazFree)
//             roomIdentifier = await getRoomIdentifier("Ahvaz", office);
//         else if (isIsfahanFree)
//             roomIdentifier = await getRoomIdentifier("Isfahan", office);
//         else if (isRashtFree)
//             roomIdentifier = await getRoomIdentifier("Rasht", office);
//         else if (isKarajFree)
//             roomIdentifier = await getRoomIdentifier("Karaj", office);
//
//     } else if (participants.length === 4) {
//         let isKarajFree = isWantedRoomFree("Karaj", office, startingTime, endingTime);
//         if (isKarajFree)
//             roomIdentifier = await getRoomIdentifier("Karaj", office);
//     }
//
//     if (roomIdentifier) {
//         let meeting = new Meeting(meetingInfo, id);
//         await dataAccess.createNewMeeting(meetingInfo, id)
//         meetingIdentifier = await meeting.getMeetingID();
//         return meetingIdentifier;
//     } else {
//         if (isBeingEdited)
//             throw 'unable to edit the chosen attribute'
//         else throw 'no room found in the given period of time for the wanted office'
//     }
// }


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
            roomIdentifier = await getRoomIdentifier("Babol", office);
        else if (isShirazFree)
            roomIdentifier = await getRoomIdentifier("Shiraz", office);
        else if (isMashhadFree)
            roomIdentifier = await getRoomIdentifier("Mashhad", office);

    } else if (participants.length === 5 || participants.length === 6) {
        let isShirazFree = isWantedRoomFree("Shiraz", office, startingTime, endingTime);
        let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);

        if (isShirazFree)
            roomIdentifier = await getRoomIdentifier("Shiraz", office);
        else if (isMashhadFree)
            roomIdentifier = await getRoomIdentifier("Mashhad", office);

    } else if (participants.length > 6 && participants.length < 9) {
        let isMashhadFree = isWantedRoomFree("Mashhad", office, startingTime, endingTime);
        if (isMashhadFree)
            roomIdentifier = await getRoomIdentifier("Mashhad", office);
    }

    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        await dataAccess.createNewMeeting(meetingInfo, id)
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }

}

//todo
async function setAMeetingInTehranRoom(meetingInfo, id, isBeingEdited) {
    const {startingTime, endingTime, office} = meetingInfo;
    let meetingIdentifier;
    let roomIdentifier;

    let isTehranFree = isWantedRoomFree("Tehran", office, startingTime, endingTime);
    if (isTehranFree)
        roomIdentifier = await getRoomIdentifier("Tehran", office);

    if (roomIdentifier) {
        let meeting = new Meeting(meetingInfo, id);
        await dataAccess.createNewMeeting(meetingInfo, id)
        meetingIdentifier = await meeting.getMeetingID();
        return meetingIdentifier;
    } else {
        if (isBeingEdited)
            throw 'unable to edit the chosen attribute'
        else throw 'no room found in the given period of time for the wanted office'
    }
}
*!/


/!*
//todo
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

//todo
async function getSoonestTimeInBigRooms(meetingInfo) {
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
*!/


/!*if (meetingInfo.purpose === MeetingPurpose.SPECREVIEW ||
                meetingInfo.participants.length > 8) {
                soonestAvailableTime = await getSoonestTimeInBigRooms(meetingInfo);
                // soonestAvailableTime = await getSoonestTimeInBigRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);
            } else if (meetingInfo.purpose === MeetingPurpose.PDCHAT ||
                meetingInfo.purpose === MeetingPurpose.INTERVIEW) {
                soonestAvailableTime = await getSoonestTime(meetingInfo);
            }
            // meetingInfo.purpose === MeetingPurpose.INTERVIEW) soonestAvailableTime = await getSoonestTime(participants, specificDate, duration, purpose, office, whiteboard, projector);
            else if (meetingInfo.purpose === MeetingPurpose.GROOMING ||
                meetingInfo.purpose === MeetingPurpose.SPRINTPLANNING) {
                soonestAvailableTime = await getSoonestTimeInMediumRooms(meetingInfo);
            }*!/
// meetingInfo.purpose === MeetingPurpose.SPRINTPLANNING) soonestAvailableTime = await getSoonestTimeInMediumRooms(participants, specificDate, duration, purpose, office, whiteboard, projector);

*/
