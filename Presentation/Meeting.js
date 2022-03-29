const express = require('express');
const Token = require('./AccessManager/Token');
const AccessManager = require('./AccessManager/AccessManager');
const RequestHandler = require('../Handler/RequestHandler');
const Exception = require('../Handler/Exception');
const app = express();

app.use(express.json());


//todo checking the token must be done by the user micro service and we cant have a copy of the token class here!

app.post('/RoomManagement/SetMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {
        title,
        descriptions,
        participants,
        startingTime,
        endingTime,
        purpose,
        office,
        whiteboard,
        projector
    } = req.body
    try {
        const requestHandler = RequestHandler.getInstance();
        const meetingIdentifier = await requestHandler.setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.id);
        res.status(201).send("The meeting was successfully created and your meeting identifier is " + meetingIdentifier);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})

app.post('/RoomManagement/GetFirstAvailableTime', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {participants, specificDate, duration, purpose, office, whiteboard, projector} = req.body
    try {
        const requestHandler = RequestHandler.getInstance();
        const firstAvailableTime = await requestHandler.getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector)
        res.status(202).send(firstAvailableTime);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/CancelMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {meetingIdentifier} = req.body
    try {
        const requestHandler = RequestHandler.getInstance();
        await requestHandler.cancelMeeting(meetingIdentifier, req.id, req.role);
        res.status(202).send("The selected meeting was successfully cancelled");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/EditMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {
        meetingIdentifier,
        title,
        descriptions,
        participants,
        startingTime,
        endingTime,
        purpose,
        office,
        whiteboard,
        projector
    } = req.body
    try {
        const requestHandler = RequestHandler.getInstance();
        await requestHandler.editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.id);
        res.status(202).send("The selected meeting was successfully edited!");
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInTimeSlot', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {startingTime, endingTime} = req.body
    try {
        const requestHandler = RequestHandler.getInstance()
        const meetingsInTimeSlot = await requestHandler.getMeetingInTimeSlot(startingTime, endingTime)
        res.status(200).send(meetingsInTimeSlot);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInRoom', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const {roomIdentifier, date} = req.body
    try {
        const requestHandler = RequestHandler.getInstance();
        const meetingsInRoom = await requestHandler.getMeetingInRoom(roomIdentifier, date)
        res.status(200).send(meetingsInRoom);
    } catch (err) {
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.listen(2000)
