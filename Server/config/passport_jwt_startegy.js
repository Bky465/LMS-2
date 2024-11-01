import UserModel from "../models/User.js";
import { Strategy as jwtStartegy, ExtractJwt } from "passport-jwt";
import passport from "passport";

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY
}

passport.use(new jwtStartegy(opts, async function (jwt_payload, done) {

    try {
        const user = await UserModel.findOne({ _id: jwt_payload._id, }).select(['-password', '-is_verified'])
        if (user) {
            return done(null, user)
        }
        else {
            return done(null, false)
        }

    }

    catch (error) {
        return done(error, false)
    }
}))