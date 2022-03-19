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
            "No meeting found in the wanted room at the given time!":
                return 404;
        }
    }
}

module.exports = Exception;