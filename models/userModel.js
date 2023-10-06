//done
import mongoose, { Schema } from "mongoose";

//schema
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required!"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required!"],
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
            minlength: [6, "Password must be at least 6 characters long!"],
            // select: true means that the password will be returned when we query for users
            select: true,
        },
        location: {
            type: String,
        },
        profileUrl: {
            type: String,
        },
        profession: {
            type: String,
        },
        // friends: [{ type: Schema.Types.ObjectId, ref: "Users" }] means that the friends field is an array of ObjectIds that belong to the Users collection
        friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
        views: [{type: String}],
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const Users = mongoose.model("Users", userSchema);

export default Users;