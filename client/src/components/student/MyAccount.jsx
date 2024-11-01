'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useGetUserDetailsQuery } from '../../../provider/redux/query/Auth'
import Modal from '../super-components/Modal'
import { ChangePasswordFormControl } from '@/config'
import FormControls from '../common-form/FormControls'
import handleVallidation from '@/utils/handleVallidation'
import { useToast } from '@/hooks/use-toast'
import { useChangePasswordMutation } from '../../../provider/redux/query/Auth'
import cleanUp from '@/utils/cleanUp'
import { MdModeEdit } from "react-icons/md";
import { Button } from '../ui/button'
import { FiLoader } from "react-icons/fi";


const MyAccount = () => {
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const { data, isSuccess } = useGetUserDetailsQuery()

  // state for change password form error
  const [changePasswordFormError, setChangePasswordFormError] = useState({})

  // state for change password form
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    password: "",
    password_confirmation: ""
  })

  const { toast } = useToast()
  const [changePassword] = useChangePasswordMutation()

  // change password form reference
  const changePasswordFormRef = useRef(null)

  // State forchange password modal
  const [isModalVisible, setIsModalVisible] = useState(false)
  // Fetching user details
  const handleGetUserDetails = () => {
    if (data && isSuccess) {
      setUserDetails(data.user)
    }
  }

  // handle change password form
  const handleChangePasswordFormSubmit = async (e) => {
    e.preventDefault()
    const vallidationResponse = await handleVallidation(changePasswordFormData, setChangePasswordFormError)

    // Check if changePasswordFormError is empty
    if (typeof (vallidationResponse) !== "object") {
      // Making API call for verify user email
      try {
        setLoading(true)
        const response = await changePassword(changePasswordFormData).unwrap()
        cleanUp(changePasswordFormData, setChangePasswordFormData)
        setLoading(false)
        toast({
          description: response.message,
          className: "text-green-500",
          duration: 3000
        })
        setIsModalVisible(false)
      } catch (error) {
        console.log('Error While changing password', error);
        setLoading(false)
        toast({
          description: error.data.message,
          className: "text-red-500",
          duration: 3000
        })
      }

    }

  }

  // Trigger handleChangePasswordFormSubmit 
  const triggerChangePasswordFormSubmit=()=>{
    changePasswordFormRef.current && changePasswordFormRef.current.requestSubmit()
  }


  // on modal close 
  const onModalClose=()=>{
    cleanUp(changePasswordFormData, setChangePasswordFormData, setChangePasswordFormError)
  }
  
  useEffect(() => {
    handleGetUserDetails()
  }, [data, isSuccess])

  return (
    <>
      <h1 className='text-3xl font-semibold text-neutral-800'>Account</h1>

      <div className='mt-6 w-full'>

        <Tabs defaultValue="user-details" className="w-full">
          <TabsList className="flex w-full gap-8 justify-start border-b border-slate-300 bg-transparent  rounded-none p-0 py-6">
            <TabsTrigger value="user-details" className='font-semibold h-full rounded-none p-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b  border-black py-6'>User Details</TabsTrigger>
            <TabsTrigger value="account-security" className='font-semibold h-full rounded-none p-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b border-black py-6'>Account Security</TabsTrigger>
          </TabsList>
          <TabsContent value="user-details" className='mt-6'>
            <div className='min-w-72 max-w-[40rem] space-y-4'>
              <div className="space-y-1">
                <Label htmlFor="user-name" className='font-semibold text-black'>User name</Label>
                <Input
                  id="user-name"
                  defaultValue={userDetails?.name}
                  className='border-black rounded-none p-4'
                  disabled={true} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className='font-semibold text-black'>Email</Label>
                <Input
                  className='border-black rounded-none p-4'
                  disabled={true}
                  id="email"
                  defaultValue={userDetails?.email} />
              </div>
              {/* <Button>Save changes</Button> */}
            </div>
          </TabsContent>
          <TabsContent value="account-security" className='mt-6'>
            <div className='min-w-72 max-w-[40rem] space-y-4'>
              <div className="space-y-1">
                <Label htmlFor="email" className='font-semibold text-black'>Email</Label>
                <Input
                  className='border-black rounded-none p-4'
                  disabled={true}
                  id={userDetails?.email}
                  defaultValue={userDetails?.email} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className='font-semibold text-black'>Password</Label>
                <div className='w-full flex'>
                  <Input
                    className='border-black rounded-none p-4'
                    disabled={true}
                    id="password"
                    defaultValue="********" />

                  {/* Change password modal */}
                  <Modal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    title="Change Password"
                    openButtonText={<MdModeEdit className='text-lg' />}
                    onModalClose={onModalClose}
                    footer={
                      <div className='flex justify-end'>
                      <Button
                        disabled={loading}
                        onClick={triggerChangePasswordFormSubmit}
                      >
                        {
                          loading ? <span className="animate-spin"><FiLoader /></span> : "Change Password"
                        }
                      </Button>
                      </div>
                    }
                  >
                    <form
                      ref={changePasswordFormRef}
                      onSubmit={handleChangePasswordFormSubmit} >
                      {/* Render form controls */}
                      <FormControls
                        formControls={ChangePasswordFormControl}
                        formData={changePasswordFormData}
                        setFormData={setChangePasswordFormData}
                        formError={changePasswordFormError}
                      />
                      <div className='flex justify-end'>
                      </div>
                    </form>
                  </Modal>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default MyAccount