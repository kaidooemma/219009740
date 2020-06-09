const router = require('express').Router();
const { Patient, Payment } = require('../models/Patient');
const Admin = require('../models/Admin');


router.get('/', (req, res)=>{
    res.render('home')
})

router.get('/newAd', (req, res)=>{
    res.render('new.ejs')
})


router.post('/newAd', (req, res)=>{
    const data = {
        username: req.body.username,
        password: req.body.password
    }
    
    Admin.findOne({username: req.body.username}).then(foundAdmin =>{
        if(foundAdmin){
            return res.json({msg: "The Admin already exist"})
        }
        Admin.create(data).then(newAdmin =>{
            return res.redirect('/dashboard');
        }).catch(error=>{res.send("Error 1 " + error.message)});
    }).catch(error=>{res.send("Error 2 " + error.message)});
})


router.post('/signin', (req, res)=>{
    const data = {
        username: req.body.username,
        password: req.body.password
    }
    Admin.findOne({username: data.username}).then(admin => {
        if(admin){
            // check password if valid and log in to dashboard
            res.redirect('/dashboard')
        }
        else { 
            res.redirect('/')
        }
    })
    .catch(error =>{
        console.log(error.message);
    })
});

router.post('/patient', (req,res)=>{
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.DOB,
        contact: req.body.contact,
        residentAddress: req.body.residentAddress,
        emergencyNo: req.body.emergencyNo,
    }
    Patient.create(data).then(patient => {
        if(patient){
            return res.redirect('/dashboard')
        }
       return res.redirect('/');
    })
});

router.get('/dashboard', (req, res)=>{
    Patient.find({}).then(patients=>{ 
        res.render('dashboard', {
        patients: patients.reverse()
    }) 
    }).catch(error =>{
        console.log(error.message)
    })
   
})








module.exports = router;