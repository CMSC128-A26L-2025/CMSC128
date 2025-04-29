import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config({path: "../server/.env"})

let accessSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
let refreshSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;

        jwt.verify(
            refreshToken, 
            refreshSecretKey,
            async (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Invalid or expired refresh token' });
                }
                
                const user = await User.findById(decoded.userId)

                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }

                const accessToken = jwt.sign(
                    { userId: user._id, user_type: user.user_type },
                    accessSecretKey,
                    { expiresIn: '10m' }
                );

                res.status(200).json({ accessToken });
            }
            
        )
    } catch (e) {
        console.error('Refresh Error: ', e)
        res.status(500).json({ error: 'Failed to access token'});
    }
}