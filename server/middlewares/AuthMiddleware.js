import { response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;
    if(!token) return response.status(401).send("Yor are not authenticated!")
        jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
            request.userId = payload.userId;
            next();
        })
};