// backend.js
import cors from "cors";
import express from "express";
import userService from "./models/user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//GET  /user

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  let promise;
  if (name && job) {
    // use the specific function for name AND job
    promise = userService.findUserByNameAndJob(name, job);
  } else {
    // getUsers already dispatches to the proper findUserByName / findUserByJob / findAll
    promise = userService.getUsers(name, job);
  }

  promise
    .then((users) => {
      // Ensure consistent response shape used by the frontend
      res.json({ users_list: users });
    })
    .catch((error) => {
      res.status(500).send("Internal server error");
    });
});

//GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Resource not found.");
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).send("Internal server error");
    });
});

//POST /users
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((newUser) => res.status(201).json(newUser))
    .catch((error) => {
      res.status(500).send("Internal server error");
    });
});

// DELETE /users/:id
//since we already have findUserByID, we just need to delete it
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .deleteUserById(id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send("User not found.");
      }
      // Successful deletion
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).send("Internal server error");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

  
