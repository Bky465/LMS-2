'use client'
import { useToast } from "@/hooks/use-toast"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import React, { useState } from 'react'
import AuthHeader from "./AuthHeader"
import { signInFormControls, signUpFormControls } from "@/config"
import CommonForm from "../common-form"
import cleanUp from "@/utils/cleanUp"
import Link from "next/link"
import handleVallidation from "@/utils/handleVallidation"
import { useUserSignupMutation, useUserSigninMutation } from "../../../provider/redux/query/Auth"
import { useRouter } from "next/navigation"
const AuthTabs = () => {

    const router = useRouter()
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("signin")

    // Sign in state 
    const [signinFormData, setSigninFormData] = useState({
        email: "",
        password: ""
    })


    // Sign up state 
    const [signupFormData, setSignupFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",

    })

    // State for storing signin validation errors
    const [signinFormError, setSigninFormError] = useState({});
    // State for storing signup validation errors
    const [signupFormError, setSignupFormError] = useState({});

    // State for loading
    const [loading, setLoading] = useState(false)


    const [userSignup] = useUserSignupMutation()
    const [userSignin] = useUserSigninMutation()


    // handling signin form
    const handleSigninSubmit = async (e) => {
        e.preventDefault()

        // Handle Vallidation
        const vallidationResponse = await handleVallidation(signinFormData, setSigninFormError)


        // Check if signinFormError is empty
        if (typeof (vallidationResponse) !== "object") {

            // Making API call for user signin

            try {
                setLoading(true)
                const response = await userSignin(signinFormData).unwrap()
                cleanUp(signinFormData, setSigninFormData)
                setLoading(false)
                toast({
                    description: response.message,
                    className: "text-green-500",
                    duration: 3000
                })

                // Redirecting to home page
                router.push('/')

            } catch (error) {
                console.log('Error While signin user', error);
                setLoading(false)
                toast({
                    description: error.data.message,
                    className: "text-red-500",
                    duration: 3000
                })
            }


        }



    }

    // handling signup form
    const handleSignupSubmit = async (e) => {
        e.preventDefault()

        // handle vallidation 
        const vallidationResponse = await handleVallidation(signupFormData, setSignupFormError)


        // Check if signupFormError is empty
        if (typeof (vallidationResponse) !== "object") {

            // Making API call for user Registration

            try {
                setLoading(true)
                const response = await userSignup(signupFormData).unwrap()
                cleanUp(signupFormData, setSignupFormData)
                setLoading(false)
                toast({
                    description: response.message,
                    className: "text-green-500",
                    duration: 3000
                })

                // Redirecting to verify-link page to verify user email
                router.push('/auth/verify-link')
            } catch (error) {
                console.log('Error While createing user', error);
                setLoading(false)
                toast({
                    description: error.data.message,
                    className: "text-red-500",
                    duration: 3000
                })
            }


        }
    }

    // Handling Tab state 
    const handleTabChange = (value) => {
        setActiveTab(value)
        if (value == "signin") {
            cleanUp(signinFormData, setSigninFormData, setSigninFormError)

        }
        if (value == 'signup') {
            cleanUp(signupFormData, setSignupFormData, setSignupFormError)
        }
    }

    return (
        <>
            <Tabs value={activeTab} defaultValue="signin" className="md:min-w-96 max-w-md shadow-xl bg-white p-4 border rounded-xl" onValueChange={handleTabChange}>
                {/* Auth Header */}
                <AuthHeader activeTab={activeTab} />

                {/* Auth tabs */}
                <TabsList className="grid w-full grid-cols-2  border-none mt-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className='mt-4'>
                    <CommonForm 
                    formControls={signInFormControls} 
                    formData={signinFormData} 
                    setFormData={setSigninFormData} 
                    formError={signinFormError} 
                    buttonText={'Sign In'} 
                    handleSubmit={handleSigninSubmit}
                    isButtonDisabled={loading}
                    />
                    <div className="flex gap-x-4 w-full justify-center mt-4 items-center">
                        <span className="w-1/2 border" />
                        <span className="text-sm font-light">OR</span>
                        <span className="w-1/2  border" />
                    </div>
                    <Link href={'/auth/reset-password-link'} ><p className="text-center text-xs text-blue-500 hover:font-medium mt-4">Forget Password?</p></Link>
                    <p className="text-center font-light mt-4 text-sm">Dont't have an account?  <span className="cursor-pointer text-blue-500 hover:font-medium" onClick={() => {
                        setActiveTab('signup')
                        cleanUp(signinFormData, setSigninFormData, setSigninFormError)
                    }}>Create an account</span> </p>
                </TabsContent>

                <TabsContent value="signup" className='mt-4'>
                    <CommonForm
                        formControls={signUpFormControls}
                        formData={signupFormData}
                        setFormData={setSignupFormData}
                        formError={signupFormError}
                        buttonText={"Sign Up"}
                        handleSubmit={handleSignupSubmit}
                        isButtonDisabled={loading}
                    />
                    <p className="text-center font-light mt-4 text-sm">Already have an account?  <span className="cursor-pointer text-blue-500 font-medium" onClick={() => {
                        setActiveTab('signin')
                        cleanUp(signupFormData, setSignupFormData, setSignupFormError)
                    }}>Sign in to your account</span> </p>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default AuthTabs