const mongoose = require('mongoose');
const Meeting = require('./Meeting')

async function connectToDB() {
    await mongoose.connect('mongodb://localhost/MeetingManager');
}

mongoose.connection.once('open', function (){
    console.log("done")
}).on('error', function (error){
    console.log('error', error)
})

module.exports = { connectToDB }