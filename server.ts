require("dotenv").config();
import {v2 as cloudinary} from 'cloudinary';
import {app} from './app';
import connectDB from './utils/db';

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLUD_API,
    api_secret: process.env.CLOUD_SECRET_KEY
}) 

// Create server 
app.listen(process.env.PORT, ()=>{
    connectDB();
});