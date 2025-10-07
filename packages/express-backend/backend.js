// backend.js
import cors from "cors";
import express from "express";
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "fff333",
      name: "Bob",
      job: "Builder"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//GET  /user
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//GET /users/:id
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

//POST /users
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

// DELETE /users/:id
//since we already have findUserByID, we just need to delete it
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const result = findUserById(id);
  if (!result) {
    //user not found
    res.status(404).send("User not found.");
  } else {
    //removes user from list, and return new list without that user
    //i used filter since it returns a new list 
    users.users_list = users.users_list.filter((user) => user["id"] != id)
    res.status(200).send("User deleted successfully.");

  }

})

//Match users if they have same name and job
const findUserByNameAndJob = (name, job) => {
  //i used filter() because it will return the new list of matching name and job
  return users.users_list.filter(
    (user) => user["name"] === name && user["job"] === job);
};

app.get("/users", (req,res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  if (name && job) {
    const result = findUserByNameAndJob(name,job);
    res.send({users_list: result});
  } else if(name) {
    const result = users.users_list.filter((user) => user["name"] === name);
    res.send({users_list: result });
  } else{
    res.send(users);
  }
})
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

  
