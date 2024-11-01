'use client'
import AuthHeader from '@/components/Auth/AuthHeader'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmailVerificationFormControl } from '@/config'
import CommonForm from '@/components/common-form'
import handleVallidation from '@/utils/handleVallidation'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useVerifyEmailMutation } from '../../../provider/redux/query/Auth'
import cleanUp from '@/utils/cleanUp'
const VerifyLink = () => {
  // state for email verfication form
  const [emailVerificationFormData, setEmailVerificationFormData] = useState({
    email: "",
    otp: ""
  })
  const [emailVerificationFormError, setEmailVerificationFormError] = useState({})
  // State for loading
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const [verifyEmail] = useVerifyEmailMutation()


  // handle email verification form 
  const handleEmailVerificationSubmit = async (e) => {
    e.preventDefault()
    const vallidationResponse = await handleVallidation(emailVerificationFormData, setEmailVerificationFormError)

    // Check if emailVerificationFormError is empty
    if (typeof (vallidationResponse) !== "object") {
      // Making API call for verify user email
      try {
        
        setLoading(true)
        const response = await verifyEmail(emailVerificationFormData).unwrap()
        cleanUp(emailVerificationFormData, setEmailVerificationFormData)
        setLoading(false)
        toast({
          description: response.message,
          className: "text-green-500",
          duration: 3000
        })
        console.log(response);

        // Redirecting to auth page
        router.push('/auth')


      } catch (error) {
        console.log('Error While verify email', error);
        setLoading(false)
        toast({
          description: error.data.message,
          className: "text-red-500",
          duration: 3000
        })
      }

    }

  }


  return (
    <Card className='min-w-96 max-w-md shadow-xl bg-white p-4 border rounded-xl'>
      <CardHeader className='space-y-0'>
        <AuthHeader headerText='Verify Your Account' />
        <CardTitle className='text-center mt-0 text-base'>Please enter your Email ID & the One-Time Password to verify your account</CardTitle>
        <CardDescription className='text-center text-sm'>A One Time Password has been sent to your Email ID</CardDescription>
      </CardHeader>

      <CardContent>
        <CommonForm
          formControls={EmailVerificationFormControl}
          formData={emailVerificationFormData}
          setFormData={setEmailVerificationFormData}
          formError={emailVerificationFormError}
          handleSubmit={handleEmailVerificationSubmit}
          isButtonDisabled={loading}
        />
      </CardContent>
    </Card>
  )
}

export default VerifyLink

