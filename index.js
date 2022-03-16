const express = require('express');
const Token = require('./AccessManager/Token');
const AccessManager = require('./AccessManager/AccessManager');
const AdminDTO = require('./DTO/Admin');
const UserDTO = require('./DTO/User')
const app = express();

app.use(express.json());

app.post('/RoomManagement/SetMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector } = req.body
    try {
        const user = UserDTO.getUserByEmail(req.email);
        user.setMeeting(title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector);
        res.status(201).send("Your meeting was successfully created!!");
    }catch (err){

    }
})

app.post('/RoomManagement/GetFirstAvailableTime', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { participants, duration, purpose, office, whiteboard, projector } = req.body
    try {
        const user = UserDTO.getUserByEmail(req.email);
        const firstAvailableTime = user.getFirstAvailableTime(participants, duration, purpose, office, whiteboard, projector);
        res.status(202).send(firstAvailableTime);

    }catch (err){

    }
})

app.post('/RoomManagement/CancelMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { meetingIdentifier } = req.body
    try {
        const user = UserDTO.getUserByEmail(req.email);
        user.cancelMeeting(meetingIdentifier);
        res.status(202).send("The selected meeting was successfully cancelled");
    }catch (err){

    }
})

app.post('/RoomManagement/EditMeeting', Token.authenticateActor, AccessManager.validateAccess, async (req, res) => {
    const { meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector } = req.body
    try {
        const user = UserDTO.getUserByEmail(req.email);
        user.editMeeting(meetingIdentifier, title, descriptions, participants, startingTime, endingTime, purpose, office, whiteboard, projector);
        res.status(202).send("The selected meeting was successfully edited!");
    }catch (err){

    }
})

app.post('/RoomManagement/GetMeetingInTimeSlot', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { meetingIdentifier } = req.body
    try {
        const admin = AdminDTO.getUserByEmail(req.email);
        const meetingsInTimeSlot = admin.getMeetingInTimeSlot(meetingIdentifier);
        res.status(200).send(meetingsInTimeSlot);
    }catch (err){

    }
})

app.post('/RoomManagement/GetMeetingInRoom', Token.authenticateActor, AccessManager.validateAccess,async (req, res) => {
    const { roomIdentifier, date } = req.body
    try {
        const admin = AdminDTO.getUserByEmail(req.email);
        const meetingsInRoom = admin.getMeetingInRoom(roomIdentifier, date);
        res.status(200).send(meetingsInRoom);
    }catch (err){

    }
})