const express = require('express');
const Token = require('../AccessManager/Token');
const AccessManager = require('../AccessManager/AccessManager');
const AdminDTO = require('../DTO/Admin');
const OrganizerDTO = require('../DTO/Organizer');
const Exception = require('../DTO/Exception');
const app = express();

app.use(express.json());

//todo checking the token must be done by the user micro service and we cant have a copy of the token class here!

app.post('/RoomManagement/SetMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector } = req.body
    try {
        const organizer = OrganizerDTO.getOrganizer();
        const meetingIdentifier = organizer.setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.email);
        res.status(201).send("The meeting was successfully created and your meeting identifier is " + meetingIdentifier);
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);
    }
})

app.post('/RoomManagement/GetFirstAvailableTime', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { participants, specificDate, duration, purpose, office, whiteboard, projector } = req.body
    try {
        const organizer = OrganizerDTO.getOrganizer();
        const firstAvailableTime = organizer.getFirstAvailableTime(participants, specificDate, duration, purpose, office, whiteboard, projector);
        res.status(202).send(firstAvailableTime);
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/CancelMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { meetingIdentifier } = req.body
    try {
        const organizer = OrganizerDTO.getOrganizer();
        await organizer.cancelMeeting(meetingIdentifier, req.email);
        res.status(202).send("The selected meeting was successfully cancelled");
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/EditMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector } = req.body
    try {
        const organizer = OrganizerDTO.getOrganizer();
        await organizer.editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector, req.email);
        res.status(202).send("The selected meeting was successfully edited!");
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInTimeSlot', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { startingTime, endingTime } = req.body
    try {
        const admin = AdminDTO.getAdmin();
        const meetingsInTimeSlot = admin.getMeetingInTimeSlot(startingTime, endingTime);
        res.status(200).send(meetingsInTimeSlot);
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.post('/RoomManagement/GetMeetingInRoom', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { roomIdentifier, date } = req.body
    try {
        const admin = AdminDTO.getAdmin();
        const meetingsInRoom = admin.getMeetingInRoom(roomIdentifier, date);
        res.status(200).send(meetingsInRoom);
    }catch (err){
        res.status(Exception.getStatusByExceptionMessage(err)).send(err);

    }
})

app.listen(2000)
