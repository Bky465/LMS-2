import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmailVerificationOTP from '../utils/sendEmailVerificationOTP.js';
import EmailVerificationModel from '../models/EmailVerification.js';
import generateTokens from '../utils/generateTokens.js';
import setTokenCookies from '../utils/setTokenCookies.js';
import userRefreshTokenModel from '../models/UserRefreshToken.js';
import transporter from '../config/emailConfig.js';
class UserController {
    // user registration

    static userRegistration = async (req, res) => {
        try {
            const { name, email, password, password_confirmation, roles } = req.body;

            // check if all required field are provided

            if (!name || !email || !password || !password_confirmation || !roles) {
                return res.status(400).json({
                    status: "failed",
                    message: "All fields are required"
                })
            }

            // Check if password and confirm password match

            if (password !== password_confirmation) {
                return res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm Password don't match"
                })
            }

            // Check if Email already exist

            const existingUser = await UserModel.findOne({ email })
            if (existingUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email already exist"
                })
            }

            // Generate SALT and hash password
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashedPassword = await bcrypt.hash(password, salt)

            // Create new user
            const newUser = await new UserModel({
                name,
                email,
                password: hashedPassword,
                roles: roles
            }).save()

            // Send email verification link 
            await sendEmailVerificationOTP(req, newUser)

            // Send success response
            res.status(201).json({
                status: "success",
                message: "Registration Success",
                user: { id: newUser._id, email: newUser.email, roles: roles }
            })

        }
        catch (error) {
            console.log(error);
            if (error.message) {
                res.status(500).json({ status: "failed", message: error.message })
            }
            res.status(500).json({ status: "failed", message: "Unable to register, Please try again later" })
        }

    }

    // User Email Verification
    static verifyEmail = async (req, res) => {
        try {

            // Extract request body parameter
            const { email, otp } = req.body

            // check if all required field are provided

            if (!email || !otp) {
                return res.status(400).json({
                    status: "failed",
                    message: "All fields are required"
                })
            }

            const existingUser = await UserModel.findOne({ email })
            // Check if Email doesn't exist
            if (!existingUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email is does not exist"
                })
            }

            //  Check if  email is  already verified

            if (existingUser.is_verified) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email is already verified"
                })
            }

            // Check if there is a matching email verification otp

            const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp })

            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    await sendEmailVerificationOTP(req, existingUser)
                    return res.status(400).json({
                        status: "failed",
                        message: "Invalid OTP, new OTP sent to your email"
                    })
                }
                return res.status(400).json({
                    status: "failded",
                    message: "Invalid OTP"
                })
            }

            // Check if OTP is expired
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds (15 mintutes)

            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);

            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerificationOTP(req, existingUser)
                return res.status(400).json({
                    status: "failed",
                    message: "OTP is expired, new OTP sent to your email"
                })
            }

            // OTP is vallid and not expired, mark email as verified

            existingUser.is_verified = true
            await existingUser.save();

            // Delete email verfication document
            await EmailVerificationModel.deleteMany({ userId: existingUser._id })

            return res.status(200).json({
                status: 'success',
                message: "Email verified successfully! You can now sign in to your account."
            })


        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "failed", message: "Unable to verify email, Please try again later" })
        }
    }
    // user Login

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body

            // check if all required field are provided

            if (!email || !password) {
                return res.status(400).json({
                    status: "failed",
                    message: "All fields are required"
                })
            }

            // Check if email is verified 
            const user = await UserModel.findOne({ email })

            // Check if user exist
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    message: "User not found"
                })
            }
            // Check if user is verified
            if (!user.is_verified) {
                return res.status(401).json({
                    status: "failed",
                    message: "Your accunt is not verified"
                })
            }

            // Compare password / Check password

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid Email or Password"
                })
            }

            //  Generate tokens
            const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);

            // set cookies
            setTokenCookies(res, user.roles, accessToken, refreshToken, accessTokenExp, refreshTokenExp)


            // Send Success Response with tokens
            res.status(200).json({
                status: "succeess",
                message: "Login Successful",
                user: { _id: user._id, email: user.email, name: user.name },
                roles: user.roles,
                access_token: accessToken,
                refresh_token: refreshToken,
                access_token_exp: accessTokenExp,
                refresh_token_exp: refreshTokenExp,
                is_auth: true
            })


        } catch (error) {
            console.log(error);
            res.status(500).res.json({
                status: "failed",
                message: "Unable to login , Try again later"
            })

        }
    }



    // get User profile information
    static userProfile = async (req, res) => {
        res.send({
            "user": req.user
        })
    }

    // Logout user
    static userLogout = async (req, res) => {

        try {

            // set blackListed value true from userRefreshToken Model

            const refreshToken = req.cookies.refreshToken

            await userRefreshTokenModel.findOneAndUpdate(
                { token: refreshToken, },
                {
                    $set: { blacklisted: true }
                }

            )

            // Clear access token, refresh token & is_auth
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.clearCookie('is_auth')
            res.clearCookie('role')

            res.status(200).json({
                status: 'success',
                message: "Logout successful"
            })

        } catch (error) {
            console.log(error);

            res.status(500).json({
                status: "failed",
                message: "Unable to logout, Please try again later"
            })

        }

    }

    // Change password

    static changeUserPassword = async (req, res) => {
        try {
            const { password, password_confirmation } = req.body

            // check if both field are provided
            if (!password || !password_confirmation) {
                res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm password are required"
                })
            }

            // Check if password & confirm password are matching
            if (password !== password_confirmation) {
                res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm password don't match"
                })
            }


            // Generate salt and hash new password


            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const newHashPassword = await bcrypt.hash(password, salt)

            //  Update user password
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })

            res.status(200).json({
                status: "success",
                message: "Password changed successfully"
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "failed",
                message: "Unable to change password, Please try again later"
            })

        }
    }


    // Send password reset link

    static sendUserPasswordResetLink = async (req, res) => {
        try {

            const { email } = req.body

            //check if email is provided
            if (!email) {
                res.status(404).json({
                    status: 'failed',
                    message: "Email is required"
                })
            }

            // Check if email is exist in database

            const user = await UserModel.findOne({ email })

            if (!user) {
                res.status(404).json({
                    status: "failed",
                    message: "Email doesn't exist"
                })
            }


            // Generate token for password
            const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY

            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" })


            // Send password rest link to provided email
            const resetLink = `${process.env.Frontend_HOST}/auth/reset-password-confirm/${user._id}/${token}`

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Password reset link",
                html: `<p>Dear ${user.name},</p><p>Please <a href="${resetLink}">click here </a> to reset your password.</p>
                <p>This Link is valid for 15 minutes. If you didn't request this Link, Please ignore this email.</p>`
            })

            // send success response 
            res.status(200).json({
                status: "success",
                message: "Password reset email sent. Please check your email."
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "failed",
                message: "Unable to send  reset password email, Please try again later"
            })
        }
    }


    // Reset password
    static userPasswordReset = async (req, res) => {
        try {

            const { password, password_confirmation } = req.body

            const { id, token } = req.params;

            // Find user by id 
            const user = await UserModel.findById(id)
            // Check if user is exist or not 
            if (!user) {
                return res.status(400).json({
                    status: "failed",
                    message: "User not found"
                })
            }

            // Check if token is vallid or not 
            const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY

            jwt.verify(token, new_secret)









            // check if both field are provided
            if (!password || !password_confirmation) {
                res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm password are required"
                })
            }

            // Check if password & confirm password are matching
            if (password !== password_confirmation) {
                res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm password don't match"
                })
            }

            // Generate SALT and hash password
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashedPassword = await bcrypt.hash(password, salt)

            //  Update user password
            await UserModel.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } })

            res.status(200).json({
                status: "success",
                message: "Password reset successfully"
            })




        } catch (error) {

            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    status: "failed",
                    message: "Token expired, Please request a new password reset link"
                })
            }
            console.log(error);
            res.status(500).json({
                status: "failed",
                message: "Unable to reset password, Please try again later"
            })

        }
    }





}

export default UserController