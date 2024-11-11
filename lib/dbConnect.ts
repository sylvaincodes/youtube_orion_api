import mongoose from "mongoose";

export function dbConnect(){

        //check if mongoose is already connected
        if(mongoose.connection.readyState  >= 1){
                console.log("already conected")
                return;
        }

        mongoose.connect(process.env.MONGO_URL as string)
        console.log("first conected")
}