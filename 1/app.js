const express = require('express')
const path =require('path');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');
const { check, validationResult } = require('express-validator');



//create express app
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/health-app', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

// check connection
db.once('open',()=>{
    console.log('connected to MongoDB')
})
// check db error
db.on('error', (err)=>{
    console.log(err);
});

// bring in models
const Patients = require('./models/patients');


// Load view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

// global variable

app.use( (req,res,next)=>{
    res.locals.errors = null;
    next();
})

app.get('/', (req, res) => {
    res.render('index', {title: 'health app'} )
});

// Add Route
app.get('/patients/add', (req, res) => {
    res.render('add_patient', {title: 'Add Patient'});
});

// Add Submit POST Route
app.post('/patients/add', (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add_patient',[check('fname','First name cannot be empty').notEmpty(),
        check('lname','Last name cannot be empty').notEmpty(),
        check('gender','Select a gender').notEmpty(),
        check('birthdate','Select birthdate').notEmpty(),
        check('address','Enter address').notEmpty(),
        check('phone','provide phone nuber').notEmpty()], {title:'Add Patient', errors: errors.array()});
    } else {
        let patient = new Patients();

        patient.fname = req.body.fname;
        patient.lname = req.body.lname;
        patient.gender = req.body.gender;
        patient.birthdate = req.body.birthdate;
        patient.address = req.body.address;
        patient.phone = req.body.phone;

    
        patient.save((err)=>{
            if (err) {
                console.log(err);
                // return;
            } else {
               res.redirect('/');
            }
        });
    };
});
// Get patients
app.get('/patients', (req,res)=>{
    Patients.find({}, (err, patients)=>{
        if (err) {
        console.log(err);
        } else {
        res.render('patients', {title:'Patients', patients: patients });
        }
    })
    
});
// Get single patient
app.get('/patients/:id',(req,res)=>{
    Patients.findById(req.params.id, (err,patient)=>{
        if (err) {
            console.log(err);
        } else {
        res.render('patient_details', {
            patient: patient
        })
        };
    });
});

// Edit Patient
app.get('/patients/edit/:id',(req,res)=>{
    Patients.findById(req.params.id, (err,patient)=>{
        if (err) {
            console.log(err);
        } else {
        res.render('edit_patient', {
            patient: patient, title: 'Edit Patient Details'
        })
        };
    });
});

app.post('/patients/edit/:id',(req,res)=>{

    let patient = {};

    patient.fname = req.body.fname;
    patient.lname = req.body.lname;
    patient.gender = req.body.gender;
    patient.bithdate = req.body.birthdate;
    patient.address = req.body.address;
    patient.phone = req.body.phone;

    let query = {_id: req.params.id};
    Patients.updateOne(query,patient, (err)=>{
        if (err) {
            console.log(err);
        } else {
        res.redirect('/patients/'+req.params.id);
        };
    });
});

app.get('/patients/delete/:id', (req,res)=>{
    let query ={_id:req.params.id};

    Patients.findByIdAndDelete(query,(err)=>{
        if (err) {
            console.log(err);
            // return;
        } else {
           res.redirect('/patients');
        };
    });

});

// payments 
app.get('/patients/payments/:id', (req,res)=>{
    Patients.findById(req.params.id, (err,patient)=>{
        if (err) {
            console.log(err);
        } else {
            res.render('payments',{title: 'Make payments', patient: patient});
        };
    });
    
});



app.post('/patients/payments/:id', (req,res)=>{
    let query ={_id:req.params.id};
    Patients.findById(query, (err,patient)=>{
        if (err) {
            console.log(err);
        }
            else {
                let payment = {payments : parseFloat(patient.payments) + parseFloat(req.body.amt) };
                Patients.findByIdAndUpdate(query,payment,{ new:true}, (err)=>{
                    if (err) {
                        console.log(err);
                        // return;
                    } else {
                        res.redirect('/patients/'+req.params.id);
                    };
                });
            };
        });
    
    
    

    

});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));