const setTokenCookies= (res,role,accessToken, refreshToken, accessTokenExp, refreshTokenExp)=> {
 
    const accessTokenMaxAge= (accessTokenExp - Math.floor(Date.now()/1000)) * 1000;

    const refreshTokenMaxAge=(refreshTokenExp - Math.floor(Date.now()/1000)) * 1000;

    // set cookies  for access token
    res.cookie('accessToken', accessToken,{
        httpOnly:true,
        secure: true, // Set to true if using Https
        maxAge: accessTokenMaxAge
    });
    // set cookie for refresh token
    res.cookie('refreshToken', refreshToken,{
        httpOnly:true,
        secure: true, // Set to true if using Https
        maxAge: refreshTokenMaxAge
    })

    // set cookie for isAuth
    res.cookie('is_auth', true,{
        httpOnly:false,
        secure: false, // Set to true if using Https
        maxAge: refreshTokenMaxAge
    })

    // set cookie for user role
    res.cookie('role', role,{
        httpOnly:false,
        secure: false, // Set to true if using Https
        maxAge: refreshTokenMaxAge
    })


}

export default setTokenCookies