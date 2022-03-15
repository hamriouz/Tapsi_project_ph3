const mongoose = require('mongoose')

/*const userSchema = new mongoose.Schema({
    name: String,
    age: Number
})*/
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        minLength: 21
    },
    city: String
})

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 === 0 ,
            message: props => '${props.value} is not an even number'
        }

    },
    email: {
        type: String,
        // required: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),

    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),

    },
    bestFriend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    hobbies: [String],
    address: addressSchema
})

// userSchema.statics.findByName = function (name){
//     return this.where({name: RegExp(name, "i")})
// }

userSchema.statics.findByName = function (name){
    return this.find({name: RegExp(name, "i")})
}

userSchema.query.byName = function (name){
    return this.where({ name: RegExp(name, "i") })
}

userSchema.methods.sayHi = function (){
    console.log("hi")
}

userSchema.virtual('namedEmail').get(function (){
    return '${this.name <${this.email}>'
})

//create middleware:

//before saving the model
userSchema.pre('save', function (next){
    this.updatedAt = Date.now()
    throw new Error("Fail Save")
    // next()
})

//after saving the model
userSchema.post("save", function (doc, next){
    doc.sayHi()
    //doc is the thing that has been saved
})
module.exports = mongoose.model("User", userSchema)


