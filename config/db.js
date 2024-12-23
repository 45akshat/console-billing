const  mongoose = require("mongoose")

// const mongoURI = 'mongodb+srv://akshat:w065QdXmmL1EdFY8@cluster0.d4digua.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb+srv://dbUser:sdsfascAADsa@cluster0.dr9bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoURI = 'mongodb+srv://slayde:slayde9638@cluster0.xycoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true';

const connectDb=()=>{
    return mongoose.connect(mongoURI);
}

module.exports={connectDb}