const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

mongoose.connection.once('open', function (){
    console.log("done")
}).on('error', function (error){
    console.log('error', error)
})