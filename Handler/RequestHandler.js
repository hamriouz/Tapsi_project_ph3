const Meeting = require('../Domain/Meeting');

class RequestHandler{
    static async setMeeting(meetingInfo, requestSenderId) {
        /*const {title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector} = meetingInfo
        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");*/
        try {
            return await Meeting.setNewMeeting(meetingInfo, requestSenderId, false);
            // const meeting = new Meeting()
        } catch (err) {
            throw err
        }
    }

    static async getFirstAvailableTime(meetingInfo) {
        /*const {participants, duration, purpose, office, whiteboard, projector} = meetingInfo;
        // const {participants, specificDate, duration, purpose, office, whiteboard, projector} = meetingInfo;
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        */
        try {
            return await Meeting.getSoonestAvailableTime(meetingInfo)
        } catch (err) {
            throw err
        }
    }

    static async cancelMeeting(meetingIdentifier, organizerId, role) {
        /*if (!(meetingIdentifier && organizerId && role))
            throw ("please fill all the information");
        */
        try {
            const meeting = await Meeting.getMeetingByIdentifier(meetingIdentifier);
            await meeting.cancelAMeeting(meetingIdentifier, organizerId, role)
        } catch (err) {
            throw err
        }
    }

    static async editMeeting(meetingInfo, requestSenderId) {
        const {meetingIdentifier} = meetingInfo;
        try {
            const meeting = await Meeting.getMeetingByIdentifier(meetingIdentifier);
            await meeting.editAMeeting(meetingInfo, requestSenderId)
        } catch (err) {
            throw err
        }
    }

    static async getMeetingInTimeSlot(startingTime, endingTime){
        // if (!(startingTime && endingTime))
        //     throw ("please fill all the information");
        if (startingTime >= endingTime)
            throw ("Invalid input!")
        try {
            return await Meeting.getMeetingInATimeSlot(startingTime, endingTime);
        }catch (err){
            throw err
        }
    }

    static async getMeetingInRoom(roomIdentifier, date){
        // if (!(roomIdentifier && date))
        //     throw ("please fill all the information");
        try {
            return await Meeting.getMeetingInARoom(roomIdentifier, date);
        }catch (err){
            throw err
        }
    }
}

module.exports = RequestHandler;
