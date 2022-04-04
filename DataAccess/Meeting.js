const {createMeeting, getListAllMeetingInTimeSlot, getListOfAllMeetingInRoom, getMeetingById, cancelChosenMeeting, changeTitle, changeDescription, changeProjector, changeParticipants, changePurpose, changeWhiteBoard} = require("./DataBaseManager/script");

class DataAccess{

    async createNewMeeting(meetingInfo, organizerId){
        try {
            await createMeeting(meetingInfo, organizerId)
        }catch (err){
            throw err;
        }
    }

    async getMeetingByIdentifier(meetingIdentifier){
       const meeting = await getMeetingById(meetingIdentifier);
       if (meeting)
           return meeting;
       else throw 'No meeting has been set with the given identifier'
    }

    async cancelChosenMeeting(meetingIdentifier) {
        try {
            await cancelChosenMeeting(meetingIdentifier);
        } catch (err) {
            throw err;
        }
    }

    async meetingsInTimeSlot(startingTime, endingTime){
        try {
            return await getListAllMeetingInTimeSlot(startingTime, endingTime);
        }catch (err){
            throw err;
        }
    }

    async meetingsInRoom(roomIdentifier, date){
        try {
            return await getListOfAllMeetingInRoom(roomIdentifier, date);
        }catch (err){
            throw err;
        }
    }

    async changeTitle(meetingIdentifier, newTitle) {
        try {
            await changeTitle(meetingIdentifier, newTitle)
        } catch (err) {
            throw err
        }
    }

    async changeDescription(meetingIdentifier, newDescription) {
        try {
            await changeDescription(meetingIdentifier, newDescription)
        } catch (err) {
            throw err
        }
    }

    async changeParticipants(meetingIdentifier, newParticipants)  {
        try {
            await changeParticipants(meetingIdentifier, newParticipants)
        } catch (err) {
            throw err;
        }
    }

    async changePurpose(meetingIdentifier, newPurpose) {
        try {
            await changePurpose(meetingIdentifier, newPurpose)
        } catch (err) {
            throw err
        }
    }

    async changeWhiteBoard(meetingIdentifier, newBoard) {
        try {
            await changeWhiteBoard(meetingIdentifier, newBoard)
        } catch (err) {
            throw err
        }
    }

}

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

module.exports = DataAccessInstance;
