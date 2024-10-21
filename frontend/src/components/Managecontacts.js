import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Managecontacts.css"; // Assume you have styles here for layout

function Managecontacts() {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null); // Contact being edited
    const [isDeleting, setIsDeleting] = useState(false); // For showing delete confirmation

    // Moved fetchContacts outside of useEffect
    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3001/contacts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(response.data.contacts);
        } catch (err) {
            console.error("Error fetching contacts:", err);
        }
    };

    useEffect(() => {
        // Fetch contacts on component mount
        fetchContacts();
    }, []);

    const handleEdit = (contact) => {
        setEditingContact(contact);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstname", editingContact.firstname);
        formData.append("lastname", editingContact.lastname);
        formData.append("phone", editingContact.phone);
        formData.append("email", editingContact.email);
        formData.append("tags", editingContact.tags);
        if (editingContact.imageFile) {
            formData.append("image", editingContact.imageFile); // Append the new image if selected
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3001/contacts/${editingContact._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Contact updated successfully!");
            setEditingContact(null); // Close the editing form
            fetchContacts(); // Refetch contacts to show updated data
        } catch (err) {
            console.error("Error updating contact:", err);
            alert("Error updating contact.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingContact({ ...editingContact, [name]: value });
    };

    const handleFileChange = (e) => {
        setEditingContact({ ...editingContact, imageFile: e.target.files[0] });
    };

    const handleDelete = async (contactId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3001/contacts/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Contact deleted successfully!");
            setContacts(contacts.filter((contact) => contact._id !== contactId)); // Remove the deleted contact from the list
        } catch (err) {
            console.error("Error deleting contact:", err);
            alert("Error deleting contact.");
        }
    };

    return (
        <div className="manage-contacts-container">
            <h2>Manage Contacts</h2>
            <div className="contacts-list">
                {contacts.map((contact) => (
                    <div key={contact._id} className="contact-card">
                        <img src={`http://localhost:3001/${contact.imageURL}`} alt="Profile" />
                        <h3>{`${contact.firstname} ${contact.lastname}`}</h3>
                        <p>{contact.phone}</p>
                        <p>{contact.email}</p>
                        <p>{contact.tags.join(", ")}</p>
                        <button onClick={() => handleEdit(contact)}>Edit</button>
                        <button onClick={() => handleDelete(contact._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {editingContact && (
                <div className="edit-contact-form">
                    <h3>Edit Contact</h3>
                    <form onSubmit={handleSave}>
                        <input
                            type="text"
                            name="firstname"
                            value={editingContact.firstname}
                            onChange={handleChange}
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            name="lastname"
                            value={editingContact.lastname}
                            onChange={handleChange}
                            placeholder="Last Name"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={editingContact.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editingContact.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="tags"
                            value={editingContact.tags}
                            onChange={handleChange}
                            placeholder="Tags (comma separated)"
                        />
                        <input type="file" name="image" onChange={handleFileChange} />

                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingContact(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Managecontacts;
