import React, { useState } from 'react';
import axios from 'axios';
import './Addcontact.css'; // Assuming this file contains styles for the form

function AddContact() {
    const [contactData, setContactData] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        tags: '',
    });
    const [image, setImage] = useState(null); // To handle file upload
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setContactData({
            ...contactData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // Remove linkusername from frontend
        formData.append('firstname', contactData.firstname);
        formData.append('lastname', contactData.lastname);
        formData.append('phone', contactData.phone);
        formData.append('email', contactData.email);
        formData.append('tags', contactData.tags.split(',')); // Assuming tags are comma-separated
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token'); // Fetching JWT from localStorage
            const response = await axios.post('http://localhost:3001/addcontact', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Use backticks for template literals
                },
            });
            setMessage('Contact added successfully');
        } catch (error) {
            console.error('Error adding contact:', error);
            setMessage('Failed to add contact');
        }
    };

    return (
        <div className="add-contact-container">
            <h2>Add New Contact</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={contactData.firstname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={contactData.lastname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={contactData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={contactData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={contactData.tags}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Upload Image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
                </div>
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
}

export default AddContact;
