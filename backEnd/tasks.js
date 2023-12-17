const mongoose = require("mongoose")
const {Schema} = require("mongoose")

const taskSchema = new Schema({
    userId :{
        type: String,
        required: true,
    },
    name: {
        type:String,
        required:true,
    }

})

taskSchema.methods.toDTO = function() {
    const obj = this.toObject()
    return {
        userId: obj.userId,
        name: obj.name,
        id: obj._id,
    }
}

const Task = mongoose.model("Task", taskSchema, "Tasks")
exports.model = Task