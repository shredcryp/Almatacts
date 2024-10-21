const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const ContactModel = require('./models/Contact');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const SECRET_KEY = "secretkey";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true // Enable credentials if you're using cookies or authentication headers
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/Almatacts", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to include timestamp
    }
});

const upload = multer({ storage: storage });

// Move this function above where it's used
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token part

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalid" });
        }

        req.user = user; // Save user info in the request
        next();
    });
};

// Sending signup data to mongodb hashing pass and taking other basic info
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email is provided and valid
        if (!email || email.trim() === "") {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });

        // Saving the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error signing up" });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, {});

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                image: user.imageURL,
            },
        });
        console.log(res.json);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error logging you in" });
    }
});

app.post("/addcontact", upload.single("image"), authenticateToken, async (req, res) => {
    try {
        const { firstname, lastname, phone, email, tags } = req.body;

        // Validate the input
        if (!firstname || !lastname || !phone || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if image was uploaded
        let imageURL = "uploads/default.jpg"; // Default image path
        if (req.file) {
            imageURL = req.file.path; // Set the image URL to the uploaded file's path
        }

        // Use the username from the authenticated user (from the token)
        const linkusername = req.user.userId;  // Extract userId from token, you may also use username if stored

        // Fetch the user's username from the database based on the userId
        const user = await UserModel.findById(linkusername);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create a new contact with the linkusername set to the logged-in user's username
        const newContact = new ContactModel({
            linkusername: user.username, // Assign the logged-in user's username here
            firstname,
            lastname,
            phone,
            email,
            tags: tags.split(','),
            imageURL,
        });

        // Save the contact to the database
        await newContact.save();

        res.status(201).json({ message: "Contact added successfully", contact: newContact });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding contact" });
    }
});



app.get("/contacts", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;  // Get the user ID from the token


        // Find the user based on the user ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(user)
        console.log(user.username)

        // Fetch contacts that have the Linkname matching the user's username
        const contacts = await ContactModel.find({ linkusername: user.username });

        // If no contacts are found
        if (contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }

        res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching contacts" });
    }
});

// Update a contact by ID
app.put("/contacts/:id", upload.single("image"), authenticateToken, async (req, res) => {
    try {
        const contactId = req.params.id;
        const { firstname, lastname, phone, email, tags } = req.body;

        // Check if the contact exists
        const contact = await ContactModel.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        // Update contact fields with new values
        contact.firstname = firstname || contact.firstname;
        contact.lastname = lastname || contact.lastname;
        contact.phone = phone || contact.phone;
        contact.email = email || contact.email;
        contact.tags = tags ? tags.split(",") : contact.tags;

        // Check if a new image file was uploaded, if yes, update the imageURL
        if (req.file) {
            contact.imageURL = req.file.path;
        }

        // Save the updated contact to the database
        await contact.save();

        res.status(200).json({ message: "Contact updated successfully", contact });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating contact" });
    }
});

// Delete a contact by ID
app.delete("/contacts/:id", authenticateToken, async (req, res) => {
    try {
        const contactId = req.params.id;

        // Find and delete the contact
        const contact = await ContactModel.findByIdAndDelete(contactId);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting contact" });
    }
});


app.listen(3001, () => {
    console.log("server is running on port 3001");
});
