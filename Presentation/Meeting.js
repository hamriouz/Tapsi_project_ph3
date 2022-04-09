const {app} = require('../app');
const RequestHandler = require('../Handler/RequestHandler');
const AccessHandler = require('../Handler/AccessHandler');
const Exception = require('../Util/ExceptionHandler/Exception');
const UndefinedException = require('../Util/ExceptionHandler/UndefinedException');

const accessHandler = AccessHandler.getInstance();

app.post('/RoomManagement/Meeting', accessHandler.isEmployee ,async (req, res) => {
    try {
        const meetingInfo = req.body;
        UndefinedException.allMeetingInfo(meetingInfo);
        const meetingIdentifier = await RequestHandler.setMeeting(meetingInfo, req.id);
        res.status(201).send("The meeting was successfully created and your meeting identifier is " + meetingIdentifier);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})

app.post('/RoomManagement/FirstAvailableTime', accessHandler.isEmployee, async (req, res) => {
    try {
        const meetingInfo = req.body;
        UndefinedException.firstAvailableTime(meetingInfo);
        const firstAvailableTime = await RequestHandler.getFirstAvailableTime(meetingInfo);
        res.status(202).send(firstAvailableTime);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/CancelMeeting', accessHandler.canCancel, async (req, res) => {
    const {meetingIdentifier} = req.body
    try {
        UndefinedException.meetingIdentifier(meetingIdentifier);
        await RequestHandler.cancelMeeting(meetingIdentifier, req.id, req.role);
        res.status(202).send("The selected meeting was successfully cancelled");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.put('/RoomManagement/EditMeeting', accessHandler.isEmployee, async (req, res) => {
    const meetingInfo = req.body;
    try {
        await RequestHandler.editMeeting(meetingInfo, req.id);
        res.status(202).send("The selected meeting was successfully edited!");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/MeetingInTimeSlot', accessHandler.isAdmin, async (req, res) => {
    const {startingTime, endingTime} = req.body
    try {
        UndefinedException.timeSlot(startingTime, endingTime);
        const meetingsInTimeSlot = await RequestHandler.getMeetingInTimeSlot(startingTime, endingTime)
        res.status(200).send(meetingsInTimeSlot);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/MeetingsInRoom',accessHandler.isAdmin, async (req, res) => {
    const {roomIdentifier, date} = req.body
    try {
        UndefinedException.meetingInRoom(roomIdentifier, date);
        const meetingsInRoom = await RequestHandler.getMeetingInRoom(roomIdentifier, date)
        res.status(200).send(meetingsInRoom);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})







// const RequestHandler = RequestHandler.getInstance();
// const meetingIdentifier = await RequestHandler.setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.id);
// const firstAvailableTime = await RequestHandler.getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector)
// const {meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector} = req.body
