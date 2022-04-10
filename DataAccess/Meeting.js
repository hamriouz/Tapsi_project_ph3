const {
    createMeeting,
    getListAllMeetingInTimeSlot,
    getListOfAllMeetingInRoom,
    getMeetingById,
    cancelChosenMeeting,
    changeTitle,
    changeDescription,
    changeParticipants,
    changePurpose,
    changeWhiteBoard
} = require("./DataBaseManager/script");

class DataAccess {

    static async createNewMeeting(meetingInfo, organizerId) {
        try {
            await createMeeting(meetingInfo, organizerId)
        } catch (err) {
            throw err;
        }
    }

    static async getMeetingByIdentifier(meetingIdentifier) {
        const meeting = await getMeetingById(meetingIdentifier);
        if (meeting)
            return meeting[0];
        else throw 'No meeting has been set with the given identifier'
    }

    static async cancelChosenMeeting(meetingIdentifier) {
        try {
            await cancelChosenMeeting(meetingIdentifier);
        } catch (err) {
            throw err;
        }
    }

    static async meetingsInTimeSlot(startingTime, endingTime) {
        try {
            return await getListAllMeetingInTimeSlot(startingTime, endingTime);
        } catch (err) {
            throw err;
        }
    }

    static async meetingsInRoom(roomIdentifier, date) {
        try {
            return await getListOfAllMeetingInRoom(roomIdentifier, date);
        } catch (err) {
            throw err;
        }
    }

    static async changeTitle(meetingIdentifier, newTitle) {
        try {
            await changeTitle(meetingIdentifier, newTitle)
        } catch (err) {
            throw err
        }
    }

    static async changeDescription(meetingIdentifier, newDescription) {
        try {
            await changeDescription(meetingIdentifier, newDescription)
        } catch (err) {
            throw err
        }
    }

    static async changeParticipants(meetingIdentifier, newParticipants) {
        try {
            await changeParticipants(meetingIdentifier, newParticipants)
        } catch (err) {
            throw err;
        }
    }

    static async changePurpose(meetingIdentifier, newPurpose) {
        try {
            await changePurpose(meetingIdentifier, newPurpose)
        } catch (err) {
            throw err
        }
    }

    static async changeWhiteBoard(meetingIdentifier, newBoard) {
        try {
            await changeWhiteBoard(meetingIdentifier, newBoard)
        } catch (err) {
            throw err
        }
    }

}

/*
const DataAccessInstance = (function () {
    let instance;

    function createInstance() {
        return new DataAccess();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();
*/

module.exports = DataAccess;
