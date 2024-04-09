import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { ObjectId } from "mongodb";
import { connectToDb, getDb } from './db.js';
import { connect } from "mongoose";
import authRouter from "./routes/auth.js";
import env from 'dotenv';
import auth from './middleware/auth.js';
const app = express();

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authRouter);
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Serve static files from the 'public' directory
let db
const PORT = process.env.PORT || 3000;
env.config()

connectToDb((err)=>{
    if(!err){
        app.listen(PORT, ()=>{
            console.log(`app listening on ${PORT}`)
        })
        db=getDb()
    }
})

connect(process.env.MONGO_ATLAS_URL)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });





// Route for rendering the index page
// app.get('/', (req, res) => {
//     // Supply necessary data to the EJS template
//     res.render('index.ejs');
// });
app.get('/', (req, res) => {
    // Supply necessary data to the EJS template
    res.render('authForm.ejs');
});

app.post('/uploadpdf', auth, async (req, res) => {
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
});



app.post('/uploadfilename', auth, async(req, res) => {
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
app.post('/delete', auth, async (req, res) => {
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
// app.post('/deleteId', async (req, res) => {
//     try {
//         const id = req.body.id;
//         const result = await db.collection('filenames').deleteOne({ ObjectId : id });
//         console.log("Delete: ", result)
//         res.redirect('/uploadpdf')
//     } catch (error) {
//         console.error('Error deleting file:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

