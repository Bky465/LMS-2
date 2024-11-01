import React from 'react'
import { Button } from '../ui/button'
import FormControls from './FormControls'
import { FiLoader } from "react-icons/fi";


const CommonForm = ({handleSubmit, buttonText,formControls= [], formData, setFormData,formError , isButtonDisabled = false}) => {
  return ( 
    <form onSubmit={handleSubmit} >
        {/* Render form controls */}
        <FormControls formControls={formControls} formData={formData} setFormData={setFormData} formError={formError}/>
        <Button disabled={isButtonDisabled} type='submit' className='mt-4 w-full'>
          {
            isButtonDisabled ? <span className="animate-spin"><FiLoader/></span> : buttonText || 'Submit'
          }
          
        </Button>
    </form>
  )
}
export default  CommonForm 
