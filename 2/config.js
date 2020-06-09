// Mongodb connection setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/goodhealthDb', { useNewUrlParser: true, useUnifiedTopology: true })
.then(results => { console.log('Connected successfully to MONGODB ..')})
.catch(error => { console.log(`Ow Sorry ${error.message} ...`)});
