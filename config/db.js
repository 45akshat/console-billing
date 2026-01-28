const  mongoose = require("mongoose")

// const mongoURI = 'mongodb+srv://akshat:w065QdXmmL1EdFY8@cluster0.d4digua.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb+srv://dbUser:sdsfascAADsa@cluster0.dr9bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
 const mongoURI = 'mongodb+srv://dbUser:a2gQu0MMjHnlsAmO@cluster0.dr9bx.mongodb.net/Console-Production';

//const mongoURI = "mongodb+srv://chaurasiyaaman2292:iNIvFBxH73jVWERF@attendance-cluster.kgvd3as.mongodb.net/test";
const connectDb=()=>{
    return mongoose.connect(mongoURI);
}

module.exports={connectDb}