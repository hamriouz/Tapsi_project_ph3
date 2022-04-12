let {functions, Meeting} = require('./Meeting');

test('unable to set meeting because no free room could be found', async () => {
    let meetingInfo = {
        'title': 'title',
        'descriptions': 'descriptions',
        'participants': 4,
        'startingTime': 1,
        'endingTime': 2,
        'purpose': 'PD-Chat',
        'office': 'Tehran',
        'whiteboard': true,
        'projector': false
    }

    functions.getRooms = () => {
        return [
            {
                'name': 'name',
                'capacity': 2,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': false
            }, {
                'name': 'name2',
                'capacity': 3,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': false
            }, {
                'name': 'name3',
                'capacity': 4,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': true
            }, {
                'name': 'name4',
                'capacity': 5,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': false
            }, {
                'name': 'name5',
                'capacity': 6,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': false
            }, {
                'name': 'name6',
                'capacity': 7,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': false
            }
        ]
    }

    let counter = 0;
    functions.isWantedRoomFree = async () => {
        if (counter !== 1) {
            counter++;
            return false;
        } else return true;
    }

    functions.getRoomIdentifier = async () => {
        return 'abc123'
    }

    try{
        await functions.setMeeting(meetingInfo, '123456', false)
    }catch (err){
        expect(err).toEqual(
            'no room found in the given period of time for the wanted office'
        )
    }
    /* expect(  async () => {
          await functions.setMeeting(meetingInfo, '123456', false)
     }).toThrow('no room found in the given period of time for the wanted office');
     // ).toBeFalsy();*/
})

test('change the participants in the meeting detail', () => {
    let meeting = {
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'participants',
        "startingTime": 'startingTime',
        "endingTime": 'endingTime',
        "purpose": 'purpose',
        "office": 'office',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    }
    expect(functions.changeParticipants(meeting, 'newParticipants')).toEqual
    ({
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'newParticipants',
        "startingTime": 'startingTime',
        "endingTime": 'endingTime',
        "purpose": 'purpose',
        "office": 'office',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    })
})

test('return false if meeting is not in participants working hour', () => {
    let participants = [123, 234, 456];
    getWorkHour = () => {
        return '10-19';
    };
    expect(functions.isInParticipantsWorkingHour(participants, 1, 12)).toBeFalsy()
})

test('return true if meeting is in participants working hour', () => {
    let participants = [123, 234, 456];
    functions.getWorkHour = () => {
        return '11-20'
    };
    expect(functions.isInParticipantsWorkingHour(participants, 13, 15)).toBeTruthy();
})

test('get an array of possible rooms for the wanted meeting', () => {
    let participants = [1, 2, 3, 4];
    let whiteboard = true;
    let projector = false;
    let allRooms = [
        {
            'name': 'name',
            'capacity': 2,
            'office': 'Tehran',
            'whiteboard': true,
            'projector': false
        }, {
            'name': 'name2',
            'capacity': 3,
            'office': 'Tehran',
            'whiteboard': false,
            'projector': false
        }, {
            'name': 'name3',
            'capacity': 4,
            'office': 'Tehran',
            'whiteboard': true,
            'projector': true
        }, {
            'name': 'name4',
            'capacity': 5,
            'office': 'Tehran',
            'whiteboard': false,
            'projector': false
        }, {
            'name': 'name5',
            'capacity': 6,
            'office': 'Tehran',
            'whiteboard': true,
            'projector': false
        }, {
            'name': 'name6',
            'capacity': 7,
            'office': 'Tehran',
            'whiteboard': true,
            'projector': false
        }
    ];
    let finalRooms =
        [
            {
                'name': 'name3',
                'capacity': 4,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': true
            }, {
            'name': 'name5',
            'capacity': 6,
            'office': 'Tehran',
            'whiteboard': true,
            'projector': false
        }];
    expect(functions.getRoomsWithRequirements(participants, whiteboard, projector, allRooms)).toEqual(finalRooms);
})

test('get soonest time', async () => {
    let meetingInfo = {
        'participants': [1, 2, 3, 4],
        'specificDate': 100000000,
        'duration': 2000000,
        'office': 'Tehran',
        'projector': true,
        'whiteboard': false
    }
    let counter = 0;
    functions.getRooms = () => {
        return [
            {
                'name': 'name',
                'capacity': 2,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': false
            }, {
                'name': 'name2',
                'capacity': 3,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': false
            }, {
                'name': 'name3',
                'capacity': 4,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': true
            }, {
                'name': 'name4',
                'capacity': 5,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': false
            }, {
                'name': 'name5',
                'capacity': 6,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': false
            }, {
                'name': 'name6',
                'capacity': 7,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': false
            }
        ]
    }
    functions.getRoomsWithRequirements = () => {
        return [
            {
                'name': 'name3',
                'capacity': 4,
                'office': 'Tehran',
                'whiteboard': true,
                'projector': true
            },
            {
                'name': 'name8',
                'capacity': 5,
                'office': 'Tehran',
                'whiteboard': false,
                'projector': true
            }
        ]
    }
    functions.isWantedRoomFree = async () => {
        if (counter !== 5) {
            counter++;
            return false;
        } else return true;
    }
    expect(await functions.getSoonestTime(meetingInfo)).toEqual(101800000);
})

test('change office', () =>{
    let meeting = {
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'participants',
        "startingTime": 'startingTime',
        "endingTime": 'endingTime',
        "purpose": 'purpose',
        "office": 'office',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    }
    expect(functions.changeOffice(meeting, 'newOffice')).toEqual
    ({
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'participants',
        "startingTime": 'startingTime',
        "endingTime": 'endingTime',
        "purpose": 'purpose',
        "office": 'newOffice',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    })
})

test('change time', () => {
    let meeting = {
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'participants',
        "startingTime": 'startingTime',
        "endingTime": 'endingTime',
        "purpose": 'purpose',
        "office": 'office',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    }
    expect(functions.changeTime(meeting, '1','2')).toEqual
    ({
        "title": 'title',
        "descriptions": 'descriptions',
        "participants": 'participants',
        "startingTime": '1',
        "endingTime": '2',
        "purpose": 'purpose',
        "office": 'office',
        "whiteboard": true,
        "projector": false,
        "roomIdentifier": 'roomIdentifier',
        "organizerId": 'organizerId'
    })
})
