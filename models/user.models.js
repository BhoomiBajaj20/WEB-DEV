const { Schema, model } = require("mongoose")
const { createHmac , randomBytes}= require("node:crypto");
const { createTokenForUser } = require("../services/auth.service");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/4035892-200.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true })


//this middleware runs before the document is saved to the database
userSchema.pre('save', function (next) {
    const user = this;

    //if the password is not modified skip hashing
    if(!user.isModified('password')) return;

    //creates a random string for added security
    const salt = randomBytes(16).toString()

    //hashes the password using sha256 with the generated salt
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    //the salt and hashes password are stored in the database
    this.salt = salt
    this.password = hashedPassword

    next()
})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({ email })
    if(!user) throw new Error('User not found!');
    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash=  createHmac('sha256', salt)
    .update(password)
    .digest("hex")

    if(hashedPassword !== userProvidedHash) throw new Error('Incorrect Password')

    const token = createTokenForUser(user)
    return token
})

const User = model('user', userSchema)

module.exports = User