import express from "express";
import UserController from "../controllers/UserController.js";
import passport from 'passport'
import accessTokenAutoRefresh from "../middleware/accessTokenAutoRefresh.js";

const router=express.Router()

// public routes
router.post('/register',UserController.userRegistration)
router.post('/verify-email',UserController.verifyEmail)
router.post('/login', UserController.userLogin)
router.post('/password-reset-link', UserController.sendUserPasswordResetLink)
router.post('/password-reset/:id/:token', UserController.userPasswordReset)



// Protected routes
router.get('/me', accessTokenAutoRefresh, passport.authenticate('jwt',{
    session:false
}) ,UserController.userProfile)

router.post('/change-password', accessTokenAutoRefresh, passport.authenticate('jwt',{
    session:false
}) ,UserController.changeUserPassword)

router.post('/logout', accessTokenAutoRefresh, passport.authenticate('jwt',{
    session:false
}) ,UserController.userLogout)


export default router