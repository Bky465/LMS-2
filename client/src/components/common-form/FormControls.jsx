import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from "@/components/ui/label"


const FormControls = ({ formControls = [], formData, setFormData , formError}) => {
    const renderComponentByType = (getControlItem) => {
        let element = null
        const currentControlItemValue = formData[getControlItem.name] || ''
        switch (getControlItem.componentType) {
            case 'input':
                element = <><Input
                    id={getControlItem.label}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    type={getControlItem.type}
                    className='focus-visible:ring-0 focus:outline-none focus:border-black'
                    value={currentControlItemValue}
                    onChange={(event) => {
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }}
                />
                {formError && formError[getControlItem.name] && <p className='mt-0.5 text-xs text-red-500 font-light'>{formError[getControlItem.name]}</p>}
                </>
                break;
            case 'select':
                element = <Select onValueChange={(value)=>{
                    setFormData({
                        ...formData,
                        [getControlItem.name]: value
                    })
                    value={currentControlItemValue}
                }}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder={getControlItem.label} />
                    </SelectTrigger>

                    <SelectContent>
                        {
                            getControlItem.options && getControlItem.options.length > 0 ? getControlItem.options.map(optionItem => {
                                <SelectItem key={optionItem.id} value={optionItem.id}>
                                    {optionItem.label}
                                </SelectItem>
                            }) : null
                        }
                    </SelectContent>
                </Select>
                break;

            case 'textarea':
                element = <Textarea
                    id={getControlItem.id}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    value={currentControlItemValue}
                    onChange={(event) => {
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }}
                />
                break;

            default:
                element = <Input
                    className='focus-visible:ring-0 focus:outline-none focus:border-black'
                    id={getControlItem.id}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    type={getControlItem.type}
                    value={currentControlItemValue}
                    onChange={(event) => {
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }}

                />
                p
                break;
        }
        return element
    }


    return (
        <div className='flex flex-col gap-3'>
            {
                formControls.map((controlItem) => {

                    return (
                        <div key={controlItem.name}>
                            <Label htmlFor={controlItem.label}>{controlItem.label}</Label>
                            
                            {
                                renderComponentByType(controlItem)                             
                            }
                            
                        </div>
                    )

                })
            }
        </div>
    )
}

export default FormControls