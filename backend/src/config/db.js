// ===========================================
// ✅ CEPS Backend — MongoDB Connection (ES6 Fixed)
// ===========================================

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt connection using URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
