const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['accepted', 'rejected', 'ignored', 'interested'],
            message: '${VALUE} is not a valid status type'
        }
    }
}, {
    timestamps: true
});

//Making compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// schema pre methods
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("Can't send request to self");
   }
   next();
})

module.exports = model('ConnectionRequest', connectionRequestSchema);