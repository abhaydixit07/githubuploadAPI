import express from 'express';
import bodyParser from 'body-parser';
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import path from 'path';
import { ObjectId } from "mongodb";
import { connectToDb, getDb } from './db.js';
import env from 'dotenv';

const saltRounds = 10;
const app = express();
let db
const PORT = process.env.PORT || 3000;
env.config()

app.use(
    session({
      secret: "TOPSECRETWORD",
      resave: false,
      saveUninitialized: true,
    })
  );

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());



connectToDb((err)=>{
    if(!err){
        app.listen(PORT, ()=>{
            console.log(`app listening on ${PORT}`)
        })
        db=getDb()
    }
})



app.get('/', (req, res) => {
    // Supply necessary data to the EJS template
    res.render('authForm.ejs');
});


app.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });


app.post('/uploadfilename', async(req, res) => {
    // Retrieve the filename from the request body
    const { fileName } = req.body;
    console.log('Received filename:', fileName);
    // Check if a file with the same name already exists
    const existingFile = await db.collection('filenames').findOne({ fileName: fileName });

    // If a file with the same name exists, send an error response
    if (existingFile) {
        return res.status(200).json({ message: 'A file with this name already exists' });
    }
    const result = await db.collection('filenames').insertOne({ fileName: fileName });
        
    // Optionally, you can perform any additional processing here
    
    // Send a response back to the client
    console.log(result)
    res.status(200).json({ message: 'Filename received successfully' });
});

app.post('/delete', async (req, res) => {
    try {
        const fileName = req.body.fileName;
        const result = await db.collection('filenames').deleteOne({ fileName: fileName });
        console.log("Delete: ", result)
        res.redirect('/uploadpdf')
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get("/uploadpdf", async(req, res) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
        try {
            // Retrieve all filenames from the MongoDB collection, sorted by ObjectId timestamp in descending order
            const filenames = await db.collection('filenames').find({}).sort({ _id: -1 }).toArray();
            
            // Supply necessary data to the EJS template
            res.render('uploadpdf.ejs', {
                accessToken: process.env.GITHUB_TOKEN,
                filenames: filenames,
                repo: process.env.GITHUB_REPO,
                owner: process.env.GITHUB_USERNAME
                
            });
        } catch (error) {
            console.error('Error retrieving filenames:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
      res.redirect("/");
    }
  });

  app.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "/uploadpdf",
      failureRedirect: "/",
    })
  );
  
passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
          
          const storedPassword = process.env.PASSWORD;
          
              if (password === storedPassword && username === process.env.USER){
                //Passed password check
                return cb(null, username);
              } else {
                //Did not pass password check
                return cb(null, false);
              }

        
      } catch (err) {
        console.log(err);
      }
    })
  );
  
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });