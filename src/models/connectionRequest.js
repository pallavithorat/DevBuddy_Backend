const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId:  {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: { 
      type: String,
      required: true, 
      enum: {
        values: ["ignored", "interested", "accepeted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
   },
  { timestamps: true }
);
// ConnectionRequest.find({fromUserId: 273478465864786587, toUserId: 273478465864786587})

// The 1 indicates ascending order for the index (documents will be indexed in ascending order of these fields).

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //compound index


connectionRequestSchema.pre("save", function (next) { //before saving data to DB this pre method will always be called
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;