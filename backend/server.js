import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
dotenv.config();

// port configuration
const port = process.env.PORT || 3000;

// server start and database connection

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Chefsense Server is running on port http://localhost:${port}`,
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database. Server not started.");
    console.error(error.message);
  });
