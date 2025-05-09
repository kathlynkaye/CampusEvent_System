import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let events = [];
let id = 0;

// Root route
app.get('/', (req, res) => {
    res.send("Hello");
});

// Retrieve all events
app.get('/events', (req, res) => {
    res.send(events);
});

// Add a new event
app.post('/events', (req, res) => {
    events.push({ id: ++id, ...req.body, attendees: [] });
    res.send("New event added successfully.");
});

// Retrieve a specific event by ID
app.get('/events/:id', (req, res) => {
    const { id } = req.params;
    const event = events.find((event) => event.id === +id);
    
    if (!event) {
        return res.status(404).send({ message: "Event not found" });
    }
    
    res.send(event);
});

// Update an event by ID
app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { titleValue, dateValue, organizerValue } = req.body;
    
    const event = events.find((event) => event.id === +id);
    
    if (!event) {
        return res.status(404).send({ message: "Event not found" });
    }
    
    event.title = titleValue;
    event.date = dateValue;
    event.organizer = organizerValue;
    
    res.send("Event successfully updated.");
});

// Delete an event by ID
app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    
    events = events.filter((event) => event.id !== +id);
    res.send("Event successfully deleted.");
});

// Get users registered for a specific event
app.get('/registration/:eventId', (req, res) => {
    const { eventId } = req.params;
    
    const event = events.find(event => event.id === +eventId);
    
    if (!event) {
        return res.status(404).send({ message: "Event not found" });
    }
    
    const users = event.attendees || [];
    res.send(users);
});

// Register a user for an event
app.post('/register', (req, res) => {
    const { eventId, name, email } = req.body;
    
    const event = events.find(e => +e.id === +eventId);
    
    if (!event) {
        return res.status(404).send({ message: "Event not found" });
    }
    
    // Initialize attendees array if not already
    if (!event.attendees) {
        event.attendees = [];
    }
    
    const alreadyRegistered = event.attendees.some(attendee => attendee.email === email);
    
    if (alreadyRegistered) {
        return res.status(400).send({ message: "Already registered" });
    }
    
    event.attendees.push({ name, email });
    return res.send({ message: "Registered successfully" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
