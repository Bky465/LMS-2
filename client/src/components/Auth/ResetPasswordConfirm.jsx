'use client'

import AuthHeader from '@/components/Auth/AuthHeader'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { ResetPasswordConfirmFormControl } from '@/config'
import CommonForm from '@/components/common-form'
import handleVallidation from '@/utils/handleVallidation'
import { useResetPasswordConfirmMutation } from '../../../provider/redux/query/Auth'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import cleanUp from '@/utils/cleanUp'
const ResetPasswordConfirm = () => {

    const [loading,setLoading]= useState(false)
    const [resetPasswordConfirmFormData, setResetPasswordConfirmFormData] = useState({
        password: "",
        password_confirmation:""
        
    })

    const [resetPasswordConfirmFormError, setResetPasswordConfirmFormError]=useState({})
    
    const [resetPasswordConfirm]= useResetPasswordConfirmMutation()

    const router = useRouter()
    const params = useParams();
    const {toast} = useToast()




    // handle email verification form 
    const handleResetPasswordConfirmFormSubmit = async(e) => {
        e.preventDefault()
       const vallidationResponse=await handleVallidation(resetPasswordConfirmFormData,setResetPasswordConfirmFormError)
       if (typeof (vallidationResponse) !== "object") {
        
        // Making API call for 
         const {id,token} = params
        try {
          setLoading(true)
          const response = await resetPasswordConfirm({id,token, ...resetPasswordConfirmFormData}).unwrap()
          console.log(response);
  
          cleanUp(resetPasswordConfirmFormData, setResetPasswordConfirmFormData)
          setLoading(false)
          toast({
            description: response.message,
            className: "text-green-500",
            duration: 3000
          })
  
          // Redirecting to auth page 
          router.push('/auth')
  
        } catch (error) {
          console.log('Error While forget password ', error);
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
                    formControls={ResetPasswordConfirmFormControl}
                    formData={resetPasswordConfirmFormData}
                    setFormData={setResetPasswordConfirmFormData}
                    formError={resetPasswordConfirmFormError}
                    handleSubmit={handleResetPasswordConfirmFormSubmit}
                    isButtonDisabled={loading}
                />
            </CardContent>
        </Card>
    )
}

export default ResetPasswordConfirm