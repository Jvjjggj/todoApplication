const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "todoapplication.db");
app.use(express.json());
const connetDBAndServer = async () => {
  try {
    const db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3005, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.log("DB Error:${error.message()}");
    process.exit(1);
  }
};
connetDBAndServer();
