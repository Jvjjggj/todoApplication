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
  const { status, priority, search_q } = request.query;
  if (status !== undefined && priority === undefined) {
    const query = `
      select * from 
         todo
      where
         status="${status}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (priority !== undefined && status === undefined) {
    const query = `
      select * 
      from 
         todo
      where 
         priority="${priority}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (status !== undefined && priority !== undefined) {
    const query = `
    select * 
    from todo
    where 
       status="${status}" and
       priority="${priority}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (search_q !== undefined) {
    const query = `
      select * 
      from 
        todo
      where 
        todo like "%${search_q}%";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else {
    const query = `
      select * 
      from 
         todo;`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  }
});

// API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
  select * 
  from 
     todo
   where 
      id=${todoId};`;
  const dbresponse = await db.get(query);
  response.send(dbresponse);
});

// API 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `
    insert into 
       todo(id,todo,priority,status)
    values(${id},"${todo}","${priority}","${status}");`;
  const dbresponse = await db.run(query);
  response.send("Todo Successfully Added");
});

// API 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;
  if (status !== undefined) {
    const query = `
          update todo
         set 
            status="${status}"
         where 
            id=${todoId};`;
    const dbresponse = await db.run(query);
    response.send("Status Updated");
  } else if (priority !== undefined) {
    const query = `
           update todo
           set 
              priority="${priority}"
            where 
              id=${todoId};`;
    const dbresponse = await db.run(query);
    response.send("Priority Updated");
  } else if (todo !== undefined) {
    const query = `
           update todo
           set 
              todo="${todo}"
           where 
              id=${todoId};`;
    const dbresponse = await db.run(query);
    response.send("Todo Updated");
  }
});

// API 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
  delete from todo 
  where 
     id=${todoId};`;
  const dbresponse = await db.run(query);
  response.send("Todo Deleted");
});

module.exports = app;
