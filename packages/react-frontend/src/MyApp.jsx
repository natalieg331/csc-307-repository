// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
  
function MyApp() { 
  const [characters, setCharacters] = useState([ ]);
  //fetch users from backend
  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    return promise; 
  }
  //run fetchUsers() once when component loads
  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
}, [] );

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((res) => {
      if (res.status === 201){
          return res.json(); //returns new user with id
        } else {
          throw new Error("Failed to create user");
        }
});

    return promise;
  }

  function removeOneCharacter(index) {
    const user = characters[index];

  const promise = fetch(`http://localhost:8000/users/${user.id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        // only update frontend state if backend delete was successful
        const updated = characters.filter((character) => character.id !== user.id);
        setCharacters(updated);
      } else if (res.status === 404) {
        console.log("User not found on backend.");
      } else {
        throw new Error("Failed to delete user.");
      }
    })
    .catch((error) => console.log(error));

  return promise;

  }
 function updateList(person) { 
    postUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      })
}
  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);
}

export default MyApp;
