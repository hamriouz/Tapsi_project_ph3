const {
    cancelChosenMeeting,
    changeTitle,
    changeParticipants,
    changeDescription,
    changeWhiteBoard,
    changeProjector,
    changePurpose,
    getMeetingById,
    createMeeting,
    isWantedRoomFree, removeCancellation
} = require('./DataBaseManager/script');
let instanceOfDataAccessOrganizer;

class Organizer {
    constructor() {
    }

    static getOrganizer() {
        if (instanceOfDataAccessOrganizer)
            return instanceOfDataAccessOrganizer;
        instanceOfDataAccessOrganizer = new Organizer();
        return instanceOfDataAccessOrganizer;
    }

    async createNewMeeting(title, description, participants, start, end, purpose, office, whiteboard, projector, roomIdentifier, organizerId){
        try {
            await createMeeting(title, description, participants, start, end, purpose, office, whiteboard, projector, roomIdentifier, organizerId)
        }catch (err){
            throw err;
        }
    }

    async cancelChosenMeeting(meetingIdentifier) {
        try {
            await cancelChosenMeeting(meetingIdentifier);
        } catch (err) {
            throw err;
        }
    }

    async removeCancellation(meetingIdentifier){
        try {
            await removeCancellation(meetingIdentifier);
        } catch (err) {
            throw err;
        }
    }

    async getMeetingById(meetingIdentifier){
        try {
            await getMeetingById(meetingIdentifier)
        }catch (err){
            throw err
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

    async isRoomFree(roomName, office, startingTime, endingTime){
        let meetingInRoom = await isWantedRoomFree(roomName, office, startingTime, endingTime)
        return !meetingInRoom;
    }

/*    async changeMeetingStartAndEnd(meetingIdentifier,) {

    } //todo if the room isnt free in the new time slot

    async changeStartingTime(meetingIdentifier,) {

    } //todo if the room isnt free at that time anymore

    async changeEndingTime(meetingIdentifier,) {

    } // todo if the room isnt*/

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

    async changeProjector(meetingIdentifier, newProjector) {
        try {
            if (newProjector === false)
                await changeProjector(meetingIdentifier, newProjector)
            else {
                //todo check if the room already has a projector or not. if it doesnt the meeting's location has to change
            }
        } catch (err) {
            throw err
        }
    } // todo if the room doesnt already have a projector and want to change not wanting to wanting

    getUserIdWithEmail(email){
        //todo return user identifier
    }

    getRoomIdentifierWithNameOffice(name, office){
        //todo return room identifier
    }
}

module.exports = Organizer;