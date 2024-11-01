import isTokenExpired from "../utils/isTokenExpired.js";

// This middleware will set Authorization Header
const setAuthHeader= async(req,res,next)=>{
    try {
        
        const accessToken= req.cookies.accessToken;

        if (accessToken || !isTokenExpired(accessToken)){
               req.headers['authorization'] = `Bearer ${accessToken}`
        }

        next()

    } catch (error) {
          console.log("Error adding access token to header",error.message);     
    }

}

export default setAuthHeader