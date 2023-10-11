import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid"; 
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import PasswordReset from "../models/PasswordReset.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL} = process.env;

let transporter = nodemailer.createTransport({ 
    host: "smtp-mail.outlook.com",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,
    },
});

export const sendVerificationEmail = async (user, res) => {
    const {_id, email, lastName} = user;

    const token = _id + uuidv4();

    const link = APP_URL + "users/verify/" + _id + "/" + token;

    //mail options
    const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Email Verification",
        html: `<div style="font-family: Arial;background-color: #ECECEC; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
        <h1 style="font-family: Arial;color: rgb(8, 56, 188); font-size: 28px; margin-bottom: 10px;">Welcome to Our Platform</h1>
        <hr style="font-family: Arial;border: 1px solid #ddd; margin-top: 20px;">
        <h4 style="font-family: Arial;font-size: 20px; margin-top: 0;">Hi ${lastName},</h4>
        <p style="font-family: Arial;font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            Thank you for joining Memories, the platform that helps you relive and share your cherished memories with friends and family. To ensure the security of your account and the integrity of our community, we need to verify your email address.
        </p>
        <p style="font-family: Arial;font-size: 16px;"><strong>This verification link expires in 1 hour :</strong></p>
        <p style="font-family: Arial;font-size: 16px;">
            <a href="${link}" style="font-family: Arial;display: inline-block; background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; transition: background-color 0.2s ease;">Verify Your Email Address</a>
        </p>
        <p style="font-family: Arial;font-size: 16px;">If you did not create an account on Memories, please disregard this email. <span style="color:  rgb(8, 56, 188)">Your account will not be activated until you verify your email.</span></p>
        <p style="font-family: Arial;font-size: 16px; margin-bottom: 65px;">If you have any questions or need assistance, please don't hesitate to contact our support team at <span style="color:  rgb(8, 56, 188)">tibadiyayash@gmail.com</span></p>
        <div style="font-family: Arial;margin-top: 20px;">
            <h5 style="font-family: Arial;font-size: 16px; margin: 5px 0;">Best Regards,</h5>
            <h5 style="font-family: Arial;font-size: 16px;">The Memories Team</h5>
        </div>
    </div>`,
    }

    try {
        const hashedToken = await hashString(token);

        const newVerifiedEmail = await Verification.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        if(newVerifiedEmail) {
            transporter
            .sendMail(mailOptions)
            .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message:
                    "Verification email has been sent to your account. Check your email for verification"
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(404).json({message: "Something went wrong"});
            });
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Something went wrong "})
    }

};

export const resetPasswordLink = async (user, res) => {
    const {_id, email} = user;

    const token = _id + uuidv4();
    const link = APP_URL + "users/reset-password/" + _id + "/" + token;


    //mail options
    const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html:`<div style="font-family: Arial; background-color: #ECECEC; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
        <h1 style="font-family: Arial; color: rgb(8, 56, 188); font-size: 28px; margin-bottom: 10px;">Welcome to Our Platform</h1>
        <hr style="font-family: Arial; border: 1px solid #ddd; margin-top: 20px;">
        <h4 style="font-family: Arial; font-size: 20px; margin-top: 0;">Hi.</h4>
        <p style="font-family: Arial; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            Thank you for joining Memories, the platform that helps you relive and share your cherished memories with friends and family. Please click the link below to reset your Password.
        </p>
        <p style="font-family: Arial; font-size: 16px;"><strong>This link expires in 10 minutes :</strong></p>
        <p style="font-family: Arial; font-size: 16px;">
            <a href=${link} style="font-family: Arial; display: inline-block; background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; transition: background-color 0.2s ease;">Reset Your Password</a>
        </p>
        <p style="font-family: Arial; font-size: 16px; margin-bottom: 65px;">If you have any questions or need assistance, please don't hesitate to contact our support team at <span style="color: rgb(8, 56, 188)">tibadiyayash@gmail.com</span></p>
        <div style="font-family: Arial; margin-top: 15px;">
            <h5 style="font-family: Arial; font-size: 16px; margin: 5px 0;">Best Regards,</h5>
            <h5 style="font-family: Arial; font-size: 16px;">The Memories Team</h5>
        </div>
    </div>`,
    };

    try{
        const hashedToken = await hashString(token);
        const resetEmail = await PasswordReset.create({
            userId: _id,
            email: email,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
        });

        if(resetEmail){
            transporter
            .sendMail(mailOptions)
            .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message: "Reset Password Link has been set to your account.",
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(404).json({ message: "Something went wrong"});
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({message: "Something went wrong"});
    }
}
