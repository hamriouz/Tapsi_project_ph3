// const organizerDomain = require("../Domain/Organizer");
// const AdminDomain = require("../Domain/Admin");
const Meeting = require('../Domain/Meeting');

class RequestHandler{
    async setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {

        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            return await Meeting.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id);
            // const meeting = new Meeting()
        } catch (err) {
            throw err
        }
    }

    async getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            return await Meeting.getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector)
        } catch (err) {
            throw err
        }
    }

    async cancelMeeting(meetingIdentifier, organizerId, role) {
        if (!(meetingIdentifier && organizerId && role))
            throw ("please fill all the information");
        try {
            const meeting = await Meeting.getMeetingByIdentifier(meetingIdentifier);
            await meeting.cancelAMeeting(meetingIdentifier, organizerId, role)
        } catch (err) {
            throw err
        }
    }

    async editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {
        try {
            const meeting = await Meeting.getMeetingByIdentifier(meetingIdentifier);
            await meeting.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
        } catch (err) {
            throw err
        }
    }

    async getMeetingInTimeSlot(startingTime, endingTime){
        if (!(startingTime && endingTime))
            throw ("please fill all the information");
        if (startingTime >= endingTime)
            throw ("Invalid input!")
        try {
            return await Meeting.getMeetingInATimeSlot(startingTime, endingTime);
        }catch (err){
            throw err
        }
    }

    async getMeetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");
        try {
            return await Meeting.getMeetingInARoom(roomIdentifier, date);
        }catch (err){
            throw err
        }
    }
}

const RequestHandlerInstance = (function () {
    let instance;

    function createInstance() {
        return new RequestHandler();
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

module.exports = RequestHandlerInstance;
