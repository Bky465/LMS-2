// This middleware will set authorization header and will refresh access token on expire.
// If we use this middleware we don't have to explicitly make request to refresh token api url

import isTokenExpired from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokenCookies from "../utils/setTokenCookies.js";
import userRefreshTokenModel from "../models/UserRefreshToken.js";
import UserModel from "../models/User.js";
const accessTokenAutoRefresh = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;

        if (accessToken || !isTokenExpired(accessToken)) {
            req.headers['authorization'] = `Bearer ${accessToken}`
        }

        // Check if access token is not available or Expired
        if (!accessToken || isTokenExpired(accessToken)) {
            const refreshToken = req.cookies.refreshToken;

            // Check if refresh token is not available
            if (!refreshToken) {
                throw new Error('Refresh token is missing')
            }

            // Get user role 
            const refreshTokenDetails= await userRefreshTokenModel.findOne({token:refreshToken})
            const userDetails= await UserModel.findById(refreshTokenDetails.userId)
         
            
        
            // Access token is expired, make a refresh token request
            const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res)

            // set Cookies
            setTokenCookies(res, userDetails.roles, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp)

            // Add the access token to the AUthorization Header
            req.headers['authorization'] = `Bearer ${newAccessToken}`

        }
        next()

    } catch (error) {
        console.log("Error adding access token to header", error.message);

        // Handle the error, such as returning an error response or rediredcting to the login page
        res.status(401).json({
            error: "Unauthorized",
            message: "Access token is missing or invalid"
        })

    }
}


export default accessTokenAutoRefresh