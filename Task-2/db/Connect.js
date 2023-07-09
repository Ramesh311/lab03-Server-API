import mongoose from "mongoose";

const  Connect=async (Uri)=>{
    try {
        const Option={
            // your database name
            dbName:'task-manager',
        }
        await mongoose.connect(Uri,Option);
        console.log("Connection Successfully..");
    } catch (err) {
        console.log(err);
    }
}
 
export default Connect;