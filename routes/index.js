const fs = require('fs')
var express = require('express');
var router = express.Router();

var XLSX = require('node-xlsx')

const Pool = require('pg').Pool
const database = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nodeUsers',
  password: 'Er325242',
  port: 5432,
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session : req.session });
});

router.post('/login', function(req, res, next){

    let user_name = req.body.user_name;
    let user_password = req.body.user_password;
    //console.log(user_name, user_password);
    if(user_name && user_password)
    {

        query = `
        SELECT * FROM user_login 
        WHERE user_name = '${user_name}'
        `;
        database.query(query, (error, data) => {
            if (error) {
              throw error
            }
            else{
                console.log("data", data.rows);
                if(data.rows.length > 0)
                {
                    for(let count = 0; count < data.rows.length; count++)
                    {
                        if(data.rows[count].user_password == user_password)
                        {
                            req.session.user_id = data.rows[count].user_id;
                            req.session.user_name = user_name;
                            req.session.user_role_id = data.rows[count].user_role_id;
                            res.render('welcom', { user_name: req.session.user_name , role_id:req.session.user_role_id, session : req.session });
                        }
                        else
                        {
                            res.send('<h1 style="text-align:center">  הסיסמה איננה נכונה </h1>');
                        }
                    }
                }
                else
                {
                    res.send('<h1 style="text-align:center"> שם המשתמש אינו קיים במערכת</h1>');
                }
                res.end();
            }
        });
    }
    else
    {
        res.send('<h1 style="text-align:center"> נא הכנס שם משתמש וסיסמה </h1>');
        res.end();
    }

});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect("/");
});

router.get('/welcom', function(req, res, next) {
    console.log(req);
    res.render('welcom', { user_name: req.session.user_name , role_id:req.session.user_role_id, session : req.session });
  });

router.get('/tamas_form', function(req, res, next) {
    const courtsFolder = './courts';
    let courtsArr = [];
    fs.readdirSync(courtsFolder).forEach(file => {
        console.log(file);
        courtsArr.push({courtName:file});
    });
    res.render('tamas_form', {courtName: courtsArr , session : req.session });
  });

router.post('/tamas_form', function(req, res, next){ 
    console.log(req.body)
    let court_name = req.body.court;
    let filename = req.body.filename;
    let num_of_col = req.body.num_of_col;
    let num_of_row = req.body.num_of_row;
    let tamas_comand = req.body.tamas_comand;
    console.log(court_name, filename, num_of_col, num_of_row, tamas_comand);

    res.render('tamas_command', {courtName: court_name , comand:tamas_comand , session : req.session });
    res.end();
});




module.exports = router;

