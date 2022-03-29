// const organizerDomain = require("../Domain/Organizer");
// const AdminDomain = require("../Domain/Admin");

class RequestHandler{
    setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {

        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            const meeting = new Meeting()

            const user = organizerDomain.getOrganizer();
            return user.setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id);
        } catch (err) {
            throw err
        }
    }


    getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector) {
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            return user.getSoonestAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector);
        } catch (err) {
            throw err
        }
    }

    async cancelMeeting(meetingIdentifier, organizerId, role) {
        if (!(meetingIdentifier && organizerId && role))
            throw ("please fill all the information");
        try {
            const user = organizerDomain.getOrganizer();
            await user.cancelAMeeting(meetingIdentifier, organizerId, role)
        } catch (err) {
            throw err
        }
    }

    async editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id) {
        try {
            const user = organizerDomain.getOrganizer();
            await user.editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, id)
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
            const admin = AdminDomain.getOrganizer();
            return admin.getMeetingInATimeSlot(startingTime, endingTime);
        }catch (err){
            throw err
        }
    }

    async getMeetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");
        try {
            const admin = AdminDomain.getOrganizer();
            return admin.getMeetingInARoom(roomIdentifier, date);
        }catch (err){
            throw err
        }
    }
}

const RequestHandlerInstance = (function () {
    let instance;

    function createInstance() {
        let classObj = new RequestHandler();
        return classObj;
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
