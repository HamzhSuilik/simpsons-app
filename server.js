'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended:true}));
// Specify a directory for static resources
app.use(express.static('./public'));
// define our method-override reference
app.use(methodOverride('_method'));
// Set the view engine for server-side templating
app.set('view engine','ejs');
// Use app cors
app.use(cors());
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// *********************************************************************************************************
// *********************************************************************************************************
// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/home',main_page);
app.post('/save',save_item);
app.get('/favorite-quotes',save_list);
app.post('/details',show_details);

app.delete('/delete_item/:q',delete_item);
app.put('/update_item/:q',update_item);

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function main_page(req, res, next) {

    
    const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
   
    superagent.get(url).set('User-Agent', '1.0').then(results=>{
        
        const data_list = results.body;

        let arr=[];

            arr = data_list.map(item=>{
                return new Data_obj(item);
            })

            res.render('home',{array:arr});
    }).catch(err=>{
        res.status(200).send(err);
    })


    // res.status(200).send('okkkk');
    // res.render('home');
}

function save_item(req,res){
    const {character,quote,image} = req.body;

    const safeValues = [character,quote,image];
    const sql = 'INSERT INTO table1 (character,quote,image) VALUES($1,$2,$3)';

    client.query(sql, safeValues).then(result=>{
        save_list(req, res);
    }).catch(err=>{
        res.status(200).send('error');
    })
}

function save_list(req, res){
    // res.render('favorite_quotes',{array:0});

    
    const sql = 'SELECT * FROM table1';

    client.query(sql).then(result=>{
        res.render('favorite_quotes',{array:result.rows});
    }).catch(err=>{
        res.status(200).send('error');
    })
}

function show_details(req, res){
    const {character,quote,image} = req.body;
    res.render('details',{character:character,quote:quote,image:image});
    // res.status(200).send(quote);
}

// helper functions

function Data_obj(data){
    this.character=data.character;
    this.quote=data.quote;
    this.image=data.image;
}

function delete_item(req, res){
    const {character,quote,image} = req.body;

    const safeValues = [quote];
    const sql = 'DELETE FROM table1 WHERE quote=$1;';


    client.query(sql, safeValues).then(result=>{
        res.status(200).send('okk');
    }).catch(err=>{
        res.status(200).send('error');
    })

    // DELETE FROM table_name WHERE condition;
}

function update_item(req, res){
    const {character,quote,image} = req.body;

    const safeValues = [character,quote,image];
    const sql = 'UPDATE table1 SET character=$1,quote=$2,image=$3 WHERE quote=$2';


    client.query(sql, safeValues).then(result=>{
        res.status(200).send('okk');
    }).catch(err=>{
        res.status(200).send('error');
    })
}

// app start point

app.get('/',(req,res)=>{
    main_page(req,res);
})


// *********************************************************************************************************
// *********************************************************************************************************
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
