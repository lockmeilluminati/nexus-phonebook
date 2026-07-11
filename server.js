const express = require('express');
const app = express();
app.use(express.json());

let servers = {};

// The Heartbeat Receiver (For the C++ Server)
app.post('/heartbeat', (req, res) => {
    const { ip, players, name } = req.body;
    servers[ip] = { ip, players, name, lastSeen: Date.now() };
    res.sendStatus(200);
});

// The Directory Fetcher (For the C++ Client)
app.get('/servers', (req, res) => {
    const now = Date.now();
    for (let ip in servers) {
        if (now - servers[ip].lastSeen > 60000) delete servers[ip]; 
    }
    res.json(Object.values(servers));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Nexus Phonebook Online on port ${PORT}!`));