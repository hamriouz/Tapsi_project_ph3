const AdminAccesses = {
    routes: [
        '/RoomManagement/SetMeeting',
        '/RoomManagement/GetFirstAvailableTime',
        '/RoomManagement/CancelMeeting',
        '/RoomManagement/EditMeeting',
        '/RoomManagement/GetMeetingInTimeSlot',
        '/RoomManagement/GetMeetingInRoom'
    ],
}

const EmployeeAccesses = {
    routes: [
        '/RoomManagement/SetMeeting',
        '/RoomManagement/GetFirstAvailableTime',
        '/RoomManagement/CancelMeeting',
        '/RoomManagement/EditMeeting'
    ],
}

module.exports = {
    admin: AdminAccesses,
    employee: EmployeeAccesses,
}