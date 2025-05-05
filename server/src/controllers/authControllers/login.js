import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" })

let accessSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
let refreshSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // console.log(`Login attempt with email: ${email}`);
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // create access token
        const accessToken = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            accessSecretKey,
            { expiresIn: '10m' }
        );

        // create refresh token
        const refreshToken = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            refreshSecretKey,
            { expiresIn: '1d' }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ accessToken: accessToken, success: true, user:user, userId: user._id, user_type: user.user_type });
    } catch (e) {
        console.error('Login Error: ', e)
        res.status(500).json({ error: 'Login failed' });
    }
};