const mongoose = require("mongoose")
const {Schema} = require("mongoose")

const authSchema = new Schema({
    email : {
        type: String,
        required: true,
    },
    password :{
       type: String,
       required: true,
    },
    id:{
        type: Schema.Types.ObjectId,
        unique:true
    }
})

authSchema.methods.toDTO = function () {
    const obj = this.toObject()
    return {
        email : obj.email,
        password : obj.password,
        id : obj._id,
    }
}

const Auth = mongoose.model("Auth", authSchema, "Auths")

exports.model = Auth;