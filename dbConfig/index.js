import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnection = async () => {
   try{
    const connection = await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
});
console.log("DB Connected Successfully");
   }catch(error){
    console.log("DB Error:" + error);
   }
};

export default dbConnection;