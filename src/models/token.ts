import mongoose from "mongoose";

interface IToken {
  userId: mongoose.Types.ObjectId,
  token: string,
}


const tokenSchema = new mongoose.Schema<IToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is required"],
    ref: "User",
  },
  token: {
    type: mongoose.Schema.Types.String,
    required: [true, "Token is required"],
  }
})


export default mongoose.model<IToken>("Token", tokenSchema);
