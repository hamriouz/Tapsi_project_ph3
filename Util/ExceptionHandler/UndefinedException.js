class UndefinedException{
    static allMeetingInfo(meetingInfo){
        const {title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector} = meetingInfo
        if (!(title && descriptions && participants && startingTime && endingTime && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");
    }
    static firstAvailableTime(meetingInfo){
        const {participants, duration, purpose, office, whiteboard, projector} = meetingInfo;
        if (!(participants && duration && purpose && office) && (whiteboard !== undefined && projector !== undefined))
            throw ("please fill all the information");

    }

    static meetingIdentifier(meetingIdentifier){
        if (!meetingIdentifier)
            throw ("please fill all the information");
    }

    static timeSlot(startingTime, endingTime){
        if (!(startingTime && endingTime))
            throw ("please fill all the information");
    }

    static meetingInRoom(roomIdentifier, date){
        if (!(roomIdentifier && date))
            throw ("please fill all the information");

    }
}

module.exports = UndefinedException;