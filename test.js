const students = [
    { name: "Alex",   capacity: 15 },
    { name: "Devlin", capacity: 15 },
    { name: "Eagle",  capacity: 13 },
    { name: "Sam",    capacity: 14 }
];

students.sort((firstItem, secondItem) => firstItem.capacity - secondItem.capacity);

function isWorkHour(participants, startingTime, endingTime) {
    let result = [];
    participants.forEach(participant => {
        let workingHour = getWorkHour(participant);
        let fields = workingHour.split('-');
        let startWorkingHour = fields[0];
        let endWorkingHour = fields[1];
        if (!(startWorkingHour <= startingTime && endWorkingHour >= endingTime)) {
            result.push(false);
        }
    })
    return !result.includes(false);
}

function getWorkHour(id){
    if (id < 100)
        return '9-18'
    else return '11-20'
}


let participantsss = [1, 2, 100, 200];
console.log(isWorkHour(participantsss, 13, 14))