const moongose = require('mongoose')

const JobSchema = new moongose.Schema({
    company: {
        type: String,
        required: [true, "please provide a company name"],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, "please provide a position"],
        maxLength: 50
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"]
    },
    createdBy: {
        type: moongose.Types.ObjectId,
        ref: "User",
        required: [true, "please provide User"],
    }
}, { timestamps: true })

module.exports = moongose.model('Job', JobSchema)
