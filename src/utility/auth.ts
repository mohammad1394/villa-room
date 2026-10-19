import {hash} from "bcryptjs";

const { compare} = require("bcryptjs");
const {sign , verify} = require("jsonwebtoken");


export const hashPassword = async (password : string) => {
    const hashedPassword = await hash(password , 12);
    return hashedPassword;
}
export const verifyPassword = async (password : string , hashedPassword :string) => {
    const isValid = await compare(password , hashedPassword);
    return isValid;
}
export  const generateAccessToken = (data :  { email: string }) => {
    const token = sign({...data} , process.env.ACCESSSTOKENSECRETKEY , {
        expiresIn : "60d"
    });
    return token;
}
export const verifyAccessToken = (token: string) => {
    try {
        const tokenPayload = verify(token , process.env.ACCESSSTOKENSECRETKEY);
        return tokenPayload;
    }
    catch(err) {
        return false;
    }
}
export const generateRefreshToken = (data:  { email: string } ) => {
    const token = sign({...data} , process.env.REFRESHTOKENSECRETKEY , {
        expiresIn: "15d"
    });
    return token;
}
export const validateEmail = (email : string) => {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
}
export const validatePhone = (phone : string) => {
    const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return pattern.test(phone);
}
export const validatePassword = (password: string) => {
    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    return pattern.test(password);
}