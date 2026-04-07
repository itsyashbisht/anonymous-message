import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database!");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || " ");
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database successfully!");
  } catch (error) {
    console.log("Db connection failed : ", error?.message);
    process.exit(1);
  }
}

export default dbConnect;
