const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let db = null;
const connetDBtoServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3016, () => {
      console.log(`server is running 3016`);
    });
  } catch (error) {
    console.log(`Server Error ${error.getMessage()}`);
    process.exit(1);
  }
};

connetDBtoServer();

// API 1

const todoFormat = (i) => {
  return {
    id: i.id,
    todo: i.todo,
    priority: i.priority,
    status: i.status,
    category: i.category,
    dueDate: i.due_date,
  };
};

app.get("/todos/", async (request, response) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = request.query;
  if (status !== "" && priority === "" && category === "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
           status="${status}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (priority !== "" && status === "" && category === "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
           priority="${priority}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (status !== "" && priority !== "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
           priority="${priority}" 
           and
           status="${status}";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (search_q !== "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
           todo like "%${search_q}%";`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (category !== "" && status !== "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
          category="${category}" and
          status="${status}" ;`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (category !== "" && priority === "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
          category="${category}" ;`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  } else if (category !== "" && priority !== "") {
    const query = `
        select 
           id,todo,priority,status,category,due_date as dueDate
        from 
           todo
        where
          category="${category}" and
          priority="${priority}" ;`;
    const dbresponse = await db.all(query);
    response.send(dbresponse);
  }
});

// API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
    select
      *
    from
      todo
    where
      id=${todoId};`;
  const dbresponse = await db.get(query);
  response.send(todoFormat(dbresponse));
});

// API3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const query = `
  select *
  from 
     todo
  where
      due_date="${date}"
  ;`;
  const dbresponse = await db.all(query);
  response.send(dbresponse);
});

// API 4

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const query = `
  insert into
      todo
    (id,todo,priority,status,category,due_date)
   values
     (${id},"${todo}","${priority}","${status}","${category}","${dueDate}");`;
  const dbresponse = await db.run(query);
  response.send("Todo Successfully Added");
});

// API 5

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const {
    status = "",
    priority = "",
    todo = "",
    category = "",
    dueDate = "",
  } = request.body;

  if (status !== "") {
    const query = `
      update todo
      set 
        status="${status}"`;
    const dbresponse = await db.run(query);
    response.send("Status Updated");
  } else if (priority !== "") {
    const query = `
      update todo
      set 
        priority="${priority}"`;
    const dbresponse = await db.run(query);
    response.send("Priority Updated");
  } else if (todo !== "") {
    const query = `
      update todo
      set 
        todo="${todo}"`;
    const dbresponse = await db.run(query);
    response.send("Todo Updated");
  } else if (category !== "") {
    const query = `
      update todo
      set 
        category="${category}"`;
    const dbresponse = await db.run(query);
    response.send("Category Updated");
  } else if (dueDate !== "") {
    const query = `
      update todo
      set 
        due_date="${dueDate}"`;
    const dbresponse = await db.run(query);
    response.send("Due Date Updated");
  }
});

// API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `
  delete from
     todo
  where 
     id=${todoId}`;
  const dbresponse = await db.run(query);
  response.send("Todo Deleted");
});
module.exports = app;

