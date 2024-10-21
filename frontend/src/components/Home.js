// In Home.js
import Sidebar from "./Sidebar";
import Card from "./Card";
import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

function Home({ searchQuery }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/contacts", {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
          },
        });
        setContacts(response.data.contacts); // Assuming your response structure contains contacts
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstname} ${contact.lastname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="both">
        <Sidebar />
        <div className="statncard">
          {filteredContacts.map((contact) => (
            <Card
              key={contact._id}
              id={contact._id}
              firstname={contact.firstname}
              lastname={contact.lastname}
              phone={contact.phone}
              email={contact.email}
              tags={contact.tags} 
              imageURL={contact.imageURL} // Pass the imageURL to the Card component
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
