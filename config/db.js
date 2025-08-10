import mongoose from "mongoose";

const connectDB = () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`Database Connected in ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
export default connectDB;
