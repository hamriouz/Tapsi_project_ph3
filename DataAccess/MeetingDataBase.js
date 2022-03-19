class MeetingDataBase{
    static meetingsInTimeSlot(startingTime, endingTime){
        let allMeetings = [];
        allMeetings.push();
        allMeetings.push();
        allMeetings.push();
        if (allMeetings.length === 0)
            throw "No meeting found in the wanted time slot!";
        return [...new Set(allMeetings)];
    }

    static meetingsInRoom(roomIdentifier, date){
        let allMeetings = [];
        allMeetings.push();
        if (allMeetings.length === 0)
            throw "No meeting found in the wanted room at the given time!";
        return allMeetings;

    }


}



module.exports = MeetingDataBase