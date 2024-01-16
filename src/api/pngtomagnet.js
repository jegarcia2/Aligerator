var express = require('express'); 
var cors = require('cors');
var app = express(); 

app.use(express.json());
app.use(cors()); // Enable CORS

app.listen(3001, function() { 
    console.log('server running on port 3001'); 
}); 

// Handle POST request
// Handle POST request
app.post('/runScript', callName);

function callName(req, res) {
    const { input_image_path, border_size } = req.body;
    if (!input_image_path || !border_size) {
        res.status(400).send('Missing input parameters'); // Handle missing parameters
        return;
    }
    var spawn = require("child_process").spawn;
    var process = spawn('python', ['./pngToMagnet.py',
     input_image_path,
     border_size.toString()]);

    process.stdout.on('data', function(data) {
        res.send(data.toString());
    });

    // Add error handling
    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send(`Script error: ${data}`);
    });
}

