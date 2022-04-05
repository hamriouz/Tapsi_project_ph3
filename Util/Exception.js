class Exception {
    static getStatusByExceptionMessage(message) {
        switch (message) {
            case
            "please fill all the information"
            :
                return 400;
            case
            "only the meeting organizer or an admin can cancel a meeting"
            :
            case "only the meeting organizer can edit a meeting"
            :
            case
            'unable to edit the chosen attribute'
            :
            case
            'no room found in the given period of time for the wanted office'
            :
                return 401;
            case
            "Invalid input!"
            :
            case
            "The meeting is not in participant(s) working hour! Please change the meeting's time!"
            :
                return 403;
            case
            "No meeting found in the wanted time slot!"
            :
            case
            "No meeting found in the wanted room at the given time!"
            :
            case "No meeting found with the given identifier!"
            :
            case
            "No room found with the given identifier!"
            :
            case
            "Meetings with less than 4 participants cant be held in rooms that have the projector feature.":
            case
            "No free room could be found"
            :
            case
            'No meeting has been set with the given identifier'
            :
            case
            'there are no small rooms with the projector feature'
            :
                return 404;
            default:
                return 404;
        }
    }
}

module.exports = Exception;