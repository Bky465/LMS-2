import { NextResponse, NextRequest } from 'next/server'


export const middleware = async (request) => {
    try {

        const isAuthenticated = request.cookies.get('is_auth')?.value
        const role = request.cookies.get('role')?.value
        const { pathname } = request.nextUrl;
        

    
        // if user is not authenticated and try access a route which start with '/student' & '/instructor' redirect them to '/auth' page
        if (!isAuthenticated && (pathname.startsWith('/student') || pathname.startsWith('/instructor'))) {
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        // if user is  authenticated and try access a route which start with '/auth' redirect them to '/student' page

        if (isAuthenticated && pathname.startsWith('/auth')) {    
            console.log('sucking here.....................');
                    
             if(role === 'user'){
              return  NextResponse.redirect(new URL('/student', request.url))
             }
             else{
                return  NextResponse.redirect(new URL('/instructor', request.url))                
             }
        }

        // if user role is student and try to access '/instructor' redirect them to '/student'
        if (role === 'user' && pathname.startsWith('/instructor')) {
          return  NextResponse.redirect(new URL('/student', request.url))
        }

        // if user role is student and try to access '/instructor' redirect them to '/student'
        if (role == 'instructor' && pathname.startsWith('/student')) {
            return  NextResponse.redirect(new URL('/instructor', request.url))
          }

        return NextResponse.next()


    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Server Error', { status: 500 });


    }

}

export const config = {
    matcher: ['/auth/:path*', '/instructor/:path*', '/student/:path*',]
}


