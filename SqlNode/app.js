

var express = require('express');
var app = express();
app.set('view engine','ejs')
app.get('/', function(req,res){

    res.render('todo')
})

app.get('/get1', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'DB_A2A9C5_db_admin',
        password: 'pass@word123',
        server: 'sql6009.site4now.net', 
        database: 'DB_A2A9C5_db' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records


        
        request.query('select * from TblTodoRecord', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
       
        });
            //putting data into the table
    });
});
app.post('/demo', function(req,res) {
    var empDet = new empModel({
      title : req.body.title,
      description : req.body.description})

         request.query('insert into TblTodoRecord (title, description ) values(title, description)',  
         function (err, recordset) 
         {
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
       
        });
    })
var server = app.listen(5000, function () {
    console.log('Server is running..');
});