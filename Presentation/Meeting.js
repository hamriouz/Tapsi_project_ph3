const express = require('express');
const RequestHandler = require('../Handler/RequestHandler');
const AccessHandler = require('../Handler/AccessHandler');
const Exception = require('../Util/Exception');
const app = express();

app.use(express.json());

const requestHandler = RequestHandler.getInstance();
const accessHandler = AccessHandler.getInstance();

//incomplete
app.post('/RoomManagement/SetMeeting', accessHandler.isEmployee ,async (req, res) => {
    try {
        // const requestHandler = RequestHandler.getInstance();
        const meetingInfo = req.body;
        const meetingIdentifier = await requestHandler.setMeeting(meetingInfo, req.id);
        // const meetingIdentifier = await requestHandler.setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.id);
        res.status(201).send("The meeting was successfully created and your meeting identifier is " + meetingIdentifier);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})

app.post('/RoomManagement/GetFirstAvailableTime', accessHandler.isEmployee, async (req, res) => {
    try {
        // const requestHandler = RequestHandler.getInstance();
        const meetingInfo = req.body;
        const firstAvailableTime = await requestHandler.getFirstAvailableTime(meetingInfo);
        // const firstAvailableTime = await requestHandler.getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector)
        res.status(202).send(firstAvailableTime);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/CancelMeeting', accessHandler.canCancel, async (req, res) => {
    const {meetingIdentifier} = req.body
    try {
        // const requestHandler = RequestHandler.getInstance();
        await requestHandler.cancelMeeting(meetingIdentifier, req.id, req.role);
        res.status(202).send("The selected meeting was successfully cancelled");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})
//incomplete
app.post('/RoomManagement/EditMeeting', accessHandler.isEmployee, async (req, res) => {
    // const {meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector} = req.body
    const meetingInfo = req.body;
    try {
        // const requestHandler = RequestHandler.getInstance();
        await requestHandler.editMeeting(meetingInfo, req.id);
        res.status(202).send("The selected meeting was successfully edited!");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInTimeSlot', accessHandler.isAdmin, async (req, res) => {
    const {startingTime, endingTime} = req.body
    try {
        // const requestHandler = RequestHandler.getInstance()
        const meetingsInTimeSlot = await requestHandler.getMeetingInTimeSlot(startingTime, endingTime)
        res.status(200).send(meetingsInTimeSlot);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInRoom',accessHandler.isAdmin, async (req, res) => {
    const {roomIdentifier, date} = req.body
    try {
        // const requestHandler = RequestHandler.getInstance();
        const meetingsInRoom = await requestHandler.getMeetingInRoom(roomIdentifier, date)
        res.status(200).send(meetingsInRoom);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})

app.listen(2000)