const MeetingDataBase = require('../DataAccess/MeetingDataBase');
// let newOrganizer;
let instance;

class OrganizerDomain {
    constructor() {
    }

    static getOrganizer() {
        if (instance)
            return instance;
        instance = new OrganizerDomain();
        return instance;

/*
        // let newOrganizer;
        (function() {
            // let instance;
            newOrganizer = function OrganizerDomain() {
                if (instance) {
                    return instance;
                }
                instance = this;
// all the functionality
                this.firstName = 'John';
                this.lastName = 'Doe';
                return instance;
            };
        }());
*/

    }

    printSalam(){
        console.log("salam")
    }

    static async getUserStatus(email){
        //todo get the data with proto

    }

    static async getUserRole(email){
        //todo get the data with proto
    }

    setNewMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, organizerEmail) {
        //todo return meeting identifier
    }

    getSoonestAvailableTime(participants, duration, purpose, office, whiteboard, projector) {

    }

    async cancelAMeeting(meetingIdentifier) {
        try {
            await MeetingDataBase.changeStatusToCancelled(meetingIdentifier);
        }catch (err){
            throw err;
        }
    }

    editAMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector) {

    }
}

module.exports = OrganizerDomain