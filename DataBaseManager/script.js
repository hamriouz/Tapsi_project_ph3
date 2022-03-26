const mongoose = require('mongoose');
const Meeting = require('./Meeting');

async function connectToDataBase() {
    mongoose.connect('mongodb://localhost/Meeting', () => {
            console.log("connected")
        },
        err => console.error(err)
    );
}

// run()
async function getMeetingById(meetingID) {
    await connectToDataBase();
    let meeting = await Meeting.findById(meetingID)
    return meeting;
}

async function createMeeting() {
    await connectToDataBase();

}

async function getFirstTimeForMeeting() {
    await connectToDataBase();

}

async function cancelChosenMeeting(meetingIdentifier) {
    await connectToDataBase();
    const meeting = await Meeting.findById(meetingIdentifier);
    meeting.isCancelled = true;
    meeting.save();

}

async function editChosenMeeting() {
    await connectToDataBase();

}

async function getListAllMeetingInTimeSlot(startingTime, endingTime) {
    await connectToDataBase();
    let firstSlot = await Meeting.where("start").lte(startingTime).where("end").gt(startingTime);
    let secondSlot = await Meeting.where("start").lt(endingTime).where("end").gte(endingTime);
    let thirdSlot = await Meeting.where("start").gte(startingTime).where("end").lte(endingTime);
    let firstAndSecond = [...firstSlot, ...secondSlot];
    let allTogether = [...firstAndSecond, thirdSlot];
    return [...new Set(allTogether)];
}

async function getListOfAllMeetingInRoom(roomIdentifier, date) {
    await connectToDataBase();
    let startingDate = date - (date % (3600 * 24 * 1000)) - 1;
    let endingDate = startingDate + (3600 * 24 * 1000) + 1;
    const meetingsInRoom = await Meeting.where("start").gt(startingDate).where("end").lt(endingDate).where("roomIdentifier").equals(roomIdentifier);
    return meetingsInRoom;

}


async function run() {
    // create new user1
    try {
        const user = new Meeting({name: "Kyle", age: 26, hobbies: ["sdcdscf", "dasas", "Sdas "], address: {}})
        await user.save()
        console.log(user)
        // create new user2
        const user2 = await Meeting.create({name: "Kyleeee", age: 232})
        console.log(user2)

        //update user
        user.name = "Sally"
        user.save()
        console.log(user)
    } catch (err) {
        console.log(err.message)
    }

    const user = await Meeting.find({name: "folan"})
    const user2 = await Meeting.exists({name: "folan"})
    const user3 = await Meeting.deleteOne({name: "folan"})
    const user4 = await Meeting.where("name").equals("folan")
    const user5 = await Meeting.where("age").gt(1212).where("name").equals("folan")
    const user6 = await Meeting.where("name").equals("folan").limit(2).select("age")
    user6[0].bestFriend = "23456789dfghj" // tuye quote id useri ke best friend mishe
    await user6[0].save()
    const user7 = await Meeting.where("age").gt(12).where("name").equals("kyle").populate("bestFriend")
    const user8 = await Meeting.find().byName("kyle")
    const user9 = await Meeting.findOne({name: "Kyle", email: "test.com"})
    // console.log(user.namedEmail) -> Kyle <test.com>


}

// getListAllMeetingInTimeSlot(123, 234).then()
// getMeetingById("623ec5479c590458bc137ba6").then();


module.exports = {
    getMeetingById,
    createMeeting,
    getFirstTimeForMeeting,
    cancelChosenMeeting,
    editChosenMeeting,
    getListAllMeetingInTimeSlot,
    getListOfAllMeetingInRoom
}
//update user:



/*
const meeting = new Meeting({
    title: "first",
    description: "des",
    participants: [123, 234, 345],
    start: 1648279412313,
    end: 1648279457572,
    purpose: "PD chat",
    office: "Tehran",
    whiteboard: true,
    projector: false,
    isCancelled: false,
    roomIdentifier: 23456,
    organizer: 123
})
await meeting.save();
console.log(meeting);

*/


/*

// const meeting = new Meeting({
//     title: "first",
//     description: "des",
//     participants: [123, 234, 2345,45678,5678],
//     start: 1648279412313,
//     end: 1648279457572,
//     purpose: "PD chat",
//     office: "Tehran",
//     whiteboard: true,
//     projector: false,
//     isCancelled: false,
//     roomIdentifier: 23456,
//     organizer: 123
// })
// await meeting.save();
// console.log(meeting);
// meeting.end = 1648281029911;
// meeting.save();
// console.log(meeting);
// const meeting = await Meeting.where("end").gt(12).where("end").lt(123412345612345234523452345);
// console.log(meeting);


/!*
mongoose.connection.once('open', function (){
    console.log("done")
}).on('error', function (error){
    console.log('error', error)
})*!/

const array1 = ["Vijendra","Singh"];
const array2 = ["Singh", "Shakya"];
const array3 = [...array1, ...array2];
console.log(array3)
const array4 = [...new Set(array3)]
console.log(array4)
*/
