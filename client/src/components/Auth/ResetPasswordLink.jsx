'use client'

import AuthHeader from '@/components/Auth/AuthHeader'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ResetPasswordFormControl } from '@/config'
import CommonForm from '@/components/common-form'
import handleVallidation from '@/utils/handleVallidation'
import { useGenerateResetPasswordLinkMutation } from '../../../provider/redux/query/Auth'
import cleanUp from '@/utils/cleanUp'
import { useRouter } from 'next/navigation'
const ResetPasswordLink = () => {

  const [loading, setLoading] = useState(false)
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    email: "",
  })

  const [resetPasswordFormError, setResetPasswordFormError] = useState({})

  const [generatePasswordLink] = useGenerateResetPasswordLinkMutation()


  const { toast } = useToast()

  const router = useRouter()

  // handle email verification form 
  const handleResetPasswordFormSubmit = async (e) => {
    e.preventDefault()
    // Handle Vallidation
    const vallidationResponse = await handleVallidation(resetPasswordFormData, setResetPasswordFormError)
    // Check if signupFormError is empty
    if (typeof (vallidationResponse) !== "object") {

      // Making API call for 

      try {
        setLoading(true)
        const response = await generatePasswordLink(resetPasswordFormData).unwrap()
        console.log(response);

        cleanUp(resetPasswordFormData, setResetPasswordFormData)
        setLoading(false)
        toast({
          description: response.message,
          className: "text-green-500",
          duration: 3000
        })

        // Redirecting to auth page 
        router.push('/auth')

      } catch (error) {
        console.log('Error While sending forget password link', error);
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
    <Card className='md:min-w-96 max-w-md shadow-xl bg-white p-4 border rounded-xl'>
      <CardHeader className='space-y-0'>
        <AuthHeader headerText='Reset Password' />
        <CardTitle className='text-center mt-0 text-base'>Reset Password</CardTitle>
      </CardHeader>

      <CardContent>
        <CommonForm
          formControls={ResetPasswordFormControl}
          formData={resetPasswordFormData}
          setFormData={setResetPasswordFormData}
          handleSubmit={handleResetPasswordFormSubmit}
          formError={resetPasswordFormError}
          isButtonDisabled={loading}
        />
      </CardContent>
    </Card>
  )
}

export default ResetPasswordLink