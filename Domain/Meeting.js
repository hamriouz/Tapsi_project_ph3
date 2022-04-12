const {MeetingPurpose} = require("../Util/Enums/MeetingPurpose");
const DataAccess = require("../DataAccess/Meeting");
// const roomClient = require('../gRPC/roomClient');
// const userClient = require('../gRPC/userClient');

const {
    getID,
    isWantedRoomFree,
    cancelChosenMeeting,
    changeProjector,
    getListAllMeetingInTimeSlot
} = require("../DataAccess/DataBaseManager/script");

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
            const meetingData = await DataAccess.getMeetingByIdentifier(meetingIdentifier)
            return new Meeting(meetingData, meetingData.organizerId)
        } catch (err) {
            throw err;
        }
    }

    static async setNewMeeting(meetingInfo, organizerId, isBeingEdited) {
        try {
            if (!functions.isInParticipantsWorkingHour(meetingInfo.participants, meetingInfo.startingTime, meetingInfo.endingTime))
                throw "The meeting is not in participant(s) working hour! Please change the meeting's time!"
            else
                return functions.setMeeting(meetingInfo, organizerId, isBeingEdited);
        } catch (err) {
            throw err
        }
    }

    static async getSoonestAvailableTime(meetingInfo) {
        try {
            return await functions.getSoonestTime(meetingInfo);
        } catch (err) {
            throw err
        }
    }

    async cancelAMeeting(meetingIdentifier, organizerId, role) {
        try {
            if (this.organizerId === organizerId || role === "admin")
                await DataAccess.cancelChosenMeeting(meetingIdentifier);
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
                await DataAccess.changeTitle(meetingIdentifier, meetingInfo.title)
            }
            if (descriptions) {
                this.description = descriptions;
                await DataAccess.changeDescription(meetingIdentifier, descriptions);
            }
            if (newParticipants) {
                if (!(functions.isInParticipantsWorkingHour(newParticipants, this.startingTime, this.endingTime)))
                    throw "The meeting is not in participant(s) working hour! Please change the meeting's time!"
                await functions.editParticipants(meetingIdentifier, this.participants, newParticipants);
                this.participants = newParticipants;
            }
            if (startingTime || endingTime) {
                if (!startingTime)
                    startingTime = this.startingTime;
                if (!endingTime)
                    endingTime = this.endingTime;
                if (!(functions.isInParticipantsWorkingHour(this.participants, startingTime, endingTime)))
                    throw "The meeting is not in participant(s) working hour! Please change the meeting's time!"

                await functions.editTime(meetingIdentifier, startingTime, endingTime);
                if (startingTime !== this.startingTime)
                    this.startingTime = startingTime;
                if (endingTime !== this.endingTime)
                    this.endingTime = endingTime;
            }
            if (purpose) {
                await DataAccess.changePurpose(meetingIdentifier, purpose);
                this.purpose = purpose;
            }
            if (whiteboard !== undefined) {
                await DataAccess.changeWhiteBoard(meetingIdentifier, whiteboard);
            }
            if (projector !== undefined) {
                await functions.editProjector(meetingIdentifier, projector);
                this.projector = projector;
            }
            if (office) {
                let changedData = functions.changeOffice(this, office);
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
            return await DataAccess.meetingsInTimeSlot(startingTime, endingTime)
        } catch (err) {
            throw err
        }
    }

    static async getMeetingInARoom(roomIdentifier, date) {
        try {
            return await DataAccess.meetingsInRoom(roomIdentifier, date)
        } catch (err) {
            throw err
        }
    }
}

const functions = {
    getWorkHour(id) {
        if (id > 200 && id < 300)
            return '9-18'
        else return '11-21'
    },

    async setMeeting(meetingInfo, id, isBeingEdited) {
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
        //todo

        //fixme
        // let allRooms = await roomClient.getAllRoomsInOffice(office);
        let allRooms = [] = functions.getRooms();
        let roomsWithRequirements = functions.getRoomsWithRequirements(participants, whiteboard, projector, allRooms);

        roomsWithRequirements.sort((first, second) => first.capacity - second.capacity);
        for (let i = 0; i < roomsWithRequirements.length; i++) {
            let isRoomFree = await isWantedRoomFree(roomsWithRequirements[i].name, office, startingTime, endingTime)
            if (isRoomFree) {
                roomIdentifier = await functions.getRoomIdentifier(roomsWithRequirements[i].name, office);
                break;
            }
        }

        if (roomIdentifier) {
            let meeting = new Meeting(meetingInfo, id);
            await DataAccess.createNewMeeting(meetingInfo, id)
            meetingIdentifier = await meeting.getMeetingID();
            return meetingIdentifier;
        } else {
            if (isBeingEdited)
                throw 'unable to edit the chosen attribute'
            throw ('no room found in the given period of time for the wanted office');
        }
    },

    async getSoonestTime(meetingInfo) {
        let {participants, specificDate, duration, office, projector, whiteboard} = meetingInfo;

        //todo
        // let allRooms = await roomClient.getAllRoomsInOffice(office);
        let allRooms = functions.getRooms();
        let e = allRooms.length
        let roomsWithRequirements = functions.getRoomsWithRequirements(participants, whiteboard, projector, allRooms);
        let r = roomsWithRequirements.length
        roomsWithRequirements.sort((first, second) => first.capacity - second.capacity);
        let r2 = roomsWithRequirements.length

        if (!specificDate) {
            const d = new Date();
            specificDate = d.getTime();
        }

        let endingSpecificTime = specificDate + duration
        let isDateOK = false;
        while (isDateOK === false) {
            /*            roomsWithRequirements.forEach(room => {
                            let isFree = isWantedRoomFree(room.name, office, specificDate, endingSpecificTime);
                            if (isFree) {
                                isDateOK = true;
                            }
                        })*/

            for (let i = 0; i < roomsWithRequirements.length; i++) {
                let isFree = await functions.isWantedRoomFree(roomsWithRequirements[i].name, office, specificDate, endingSpecificTime);
                if (isFree)
                    isDateOK = true;
            }

            if (isDateOK) {
                return specificDate;
            } else {
                specificDate += (15 * 1000 * 60);
                endingSpecificTime += (15 * 1000 * 60);
            }
        }
    },

    async editTime(meetingIdentifier, startingTime, endingTime) {
        try {
            const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
            await cancelChosenMeeting(meetingIdentifier);
            if (!startingTime)
                startingTime = meeting.start;
            if (!endingTime)
                endingTime = meeting.end;
            let newData = functions.changeTime(meeting, startingTime, endingTime);
            await Meeting.setNewMeeting(newData, meeting.organizer, true);
        } catch (err) {
            throw err;
        }

    },

    async editParticipants(meetingIdentifier, oldParticipant, newParticipants) {
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        const meetingCapacity = await functions.getMeetingRoomCapacity(meeting.roomIdentifier);
        if (oldParticipant.length === newParticipants.length ||
            newParticipants.length <= meetingCapacity)
            await DataAccess.changeParticipants(meetingIdentifier, newParticipants)
        else {
            try {
                await cancelChosenMeeting(meetingIdentifier);
                let newData = functions.changeParticipants(meeting, newParticipants);
                await Meeting.setNewMeeting(newData, meeting.organizer, true);
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

    async getMeetingRoomCapacity(meetingIdentifier) {
        let roomCapacity;
        const meeting = Meeting.getMeetingByIdentifier(meetingIdentifier);
        const roomIdentifier = meeting.roomIdentifier;
        //todo
        // roomCapacity = await roomClient.getRoomCapacity(roomIdentifier);
        roomCapacity = [];
        return roomCapacity;
    },

    async getRoomIdentifier(roomName, office) {
        //todo
        // return await roomClient.getRoomIdentifier(office, roomName);
        return '12345';
    },

    getRoomsWithRequirements(participants, whiteBoard, projector, allRooms) {
        let possibleRooms = [];
        if (whiteBoard === true) {
            for (let i = 0; i < allRooms.length; i++) {
                if (allRooms[i].whiteboard === true)
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
        roomsWithAllRequirements.forEach(room => {
            if (room.capacity >= participants.length && room.capacity <= (participants.length + 2))
                finalRooms.push(room);
        })
        return finalRooms;
    },

    isInParticipantsWorkingHour(participants, startingTime, endingTime) {
        // const dateObjectStart = new Date(startingTime);
        // const dateObjectEnd = new Date(endingTime);
        // let hourOfStartingTime = dateObjectStart.getHours();
        // let hourOfEndingTime = dateObjectEnd.getHours();
        // let minuteOfEndingTime = dateObjectEnd.getMinutes();
        // if (minuteOfEndingTime > 0)
        //     hourOfEndingTime += 1;
        let hourOfStartingTime = startingTime;
        let hourOfEndingTime = endingTime;
        let result = [];

        participants.forEach(participant => {
            //fixme
            // let workingHour = await userClient.getUserWorkingHour(participant);
            let workingHour = functions.getWorkHour(participant);
            let fields = workingHour.split('-');
            let startWorkingHour = fields[0];
            let endWorkingHour = fields[1];
            if (!(startWorkingHour <= hourOfStartingTime && endWorkingHour >= hourOfEndingTime))
                result.push(false);

        })
        return !result.includes(false);
    },

    getRooms() {
        return [{'salam': 'sss'}];
    },

    changeOffice(meeting, newOffice) {
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
    },

    changeTime(meeting, newStartingTime, newEndingTime) {
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
    },

    changeParticipants(meeting, participants) {
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
    },


};


module.exports = {
    Meeting,
    functions
}

