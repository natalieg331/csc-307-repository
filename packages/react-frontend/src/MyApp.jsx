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
  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }
 function updateList(person) {
    setCharacters([...characters, person]);
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
