const { Schema, Types } = require("mongoose");
const moment = require('moment');

const reactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAt) => moment(createdAt).format('LLLL')
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = reactionSchema;