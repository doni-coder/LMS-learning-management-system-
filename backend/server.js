import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { server } from "./src/app.js";
import { connectDB } from "./src/db/noSql.db.js";

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    server.listen(process.env.PORT || 5050, () => {
      console.log(`Server is running on port ${process.env.PORT || 5050}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  });
