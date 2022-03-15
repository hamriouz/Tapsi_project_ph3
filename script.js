const mongoose = require('mongoose');
const User = require('./User');
mongoose.connect('mongodb://localhost/test', () => {
    console.log("connected")
},
    err => console.error(err)
);


run()

async function run(){
    // create new user1
    try {
        const user = new User({name: "Kyle", age: 26, hobbies: ["sdcdscf", "dasas", "Sdas "], address: {}})
        await user.save()
        console.log(user)
        // create new user2
        const user2 = await User.create({name: "Kyleeee", age: 232})
        console.log(user2)

        //update user
        user.name = "Sally"
        user.save()
        console.log(user)
    }catch (err){
        console.log(err.message)
    }

    const user = await User.find({name: "folan"})
    const user2 = await User.exists({name: "folan"})
    const user3 = await User.deleteOne({name: "folan"})
    const user4 = await User.where("name").equals("folan")
    const user5 = await User.where("age").gt(1212).where("name").equals("folan")
    const user6 = await User.where("name").equals("folan").limit(2).select("age")
    user6[0].bestFriend = "23456789dfghj" // tuye quote id useri ke best friend mishe
    await user6[0].save()
    const user7 = await User.where("age").gt(12).where("name").equals("kyle").populate("bestFriend")
    const user8  = await User.find().byName("kyle")
    const user9 = await User.findOne({ name: "Kyle", email: "test.com"})
    // console.log(user.namedEmail) -> Kyle <test.com>


}

//update user:


/*
mongoose.connection.once('open', function (){
    console.log("done")
}).on('error', function (error){
    console.log('error', error)
})*/

