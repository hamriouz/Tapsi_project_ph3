const DataBaseManager = require('../DataBaseManager/script');

class MeetingDataBase {
    static async meetingsInTimeSlot(startingTime, endingTime) {
        try {
            return DataBaseManager.getListAllMeetingInTimeSlot(startingTime, endingTime);
        } catch (err) {
            throw err;
        }
    }

    static async meetingsInRoom(roomIdentifier, date) {
        try {
            return DataBaseManager.getListOfAllMeetingInRoom(roomIdentifier, date);
        } catch (err) {
            throw err;
        }
    }

    static async changeStatusToCancelled(meetingIdentifier) {
        const meeting = await DataBaseManager.getMeetingById(meetingIdentifier);
        if (!meeting)
            throw "No meeting found with the given identifier!"
        try {
            await DataBaseManager.cancelChosenMeeting(meetingIdentifier);
        } catch (err) {
            throw err;
        }
    }
}


module.exports = MeetingDataBase



/*
        let allMeetings = [];
        allMeetings.push();
        allMeetings.push();
        allMeetings.push();
        if (allMeetings.length === 0)
            throw "No meeting found in the wanted time slot!";
        return [...new Set(allMeetings)];
        */
/*        let allMeetings = [];
allMeetings.push();
if (allMeetings.length === 0)
    throw "No meeting found in the wanted room at the given time!";
    */