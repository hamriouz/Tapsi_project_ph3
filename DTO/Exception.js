class Exception {
    static getStatusByExceptionMessage(message) {
        switch (message) {
            case
            "please fill all the information"
            :
                return 400;
            case
            "Invalid input!"
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
                return 404;
            default:
                return 404;
        }
    }
}

module.exports = Exception;