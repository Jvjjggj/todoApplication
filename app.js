const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoapplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3005, () => {
      console.log("Server Running at http://localhost:3005/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// API 1

app.get("/todos/", async (request, response) => {
  const para1 = request.query;
  if ("priority" in para1) {
    response.send("para1");
  } else if ("status" in para1) {
    response.send(para1);
  } else {
    const query = `
    select * from todo
    `;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  }
});
