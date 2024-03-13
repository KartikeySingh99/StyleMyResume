import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Tooltip } from '@mui/material';

const Form = ({ sectionName, label, defaultValues = {}, formFields, dynamicFields, onSubmit, setValue, value }) => {

    const { control, handleSubmit } = useForm({ defaultValues })
    const { fields, append, remove } = useFieldArray({ control, name: `${label}Array` })

    const [expanded, setExpanded] = useState(0)

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    }

    return (
        <>
            <div className='w-full h-full'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-lg font-semibold'>{sectionName}</h1>
                    {
                        label === "educationDetails" || label === "skills" || label === "projects" || label === "experience" ?
                            <div className='hover:cursor-pointer' onClick={() => append()}>
                                <Tooltip title="Add More" placement='left' arrow>
                                    <AddIcon fontSize='medium' />
                                </Tooltip>
                            </div>
                            : null
                    }
                </div>
                <form className='text-center' onSubmit={handleSubmit(onSubmit)}>
                    {
                        fields.map((item, i) => (

                            <div key={item.id} className='w-full flex items-start justify-center gap-x-2'>
                                < Accordion key={item.id} className='w-full' expanded={expanded === i} onChange={handleChange(i)} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <div className='flex items-center justify-center gap-x-4'>
                                            <h1 className='text-sm font-semibold'>{sectionName} {i + 1}</h1>
                                        </div>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <div className='flex justify-center flex-wrap gap-x-4 gap-y-2 lg:gap-y-4 w-full'>
                                            {
                                                dynamicFields && dynamicFields.map((item, j) => (
                                                    <Controller
                                                        key={j}
                                                        name={`${label}Array[${i}].${item.name}`}
                                                        control={control}
                                                        render={({ field }) => <TextField type={item.type} {...field} name={item.name} label={item.name} placeholder={item.placeholder} variant="outlined" margin='dense' />}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                                <button className='text-red-500' onClick={() => remove(item.id)}><RemoveCircleIcon fontSize='medium' /></button>

                            </div>
                        ))
                    }
                    <div className='flex my-4 gap-y-2 gap-x-4 lg:gap-y-4 justify-center flex-col lg:flex-row flex-wrap'>

                        {
                            formFields && formFields.map((fields, j) => (
                                <Controller
                                    key={j}
                                    name={fields.name}
                                    control={control}
                                    render={({ field }) => <TextField type={fields.type} {...field} name={fields.name} label={fields.name} placeholder={fields.placeholder} variant="outlined" margin='dense' />}
                                />
                            ))
                        }
                    </div>
                    <div className='flex items-center justify-center gap-x-4  mt-6'>
                        {
                            value > 0 &&
                            <button className='bg-zinc-400 text-white font-semibold hover:outline outline-zinc-400 transition-all duration-150 ease-in-out py-2 px-4 rounded-lg' onClick={() => { setValue(value - 1) }}>Back</button>
                        }

                        <button type='submit' className='bg-amber-400 text-white font-semibold hover:outline outline-amber-400 transition-all duration-150 ease-in-out py-2 px-4 rounded-lg'>Submit</button>
                        {
                            value < 4 &&
                            <button type='button' className='bg-primary text-white font-semibold hover:outline outline-primary transition-all duration-150 ease-in-out py-2 px-4 rounded-lg' onClick={() => { setValue(value + 1) }}>Next </button>
                        }
                    </div>
                </form>
            </div >
        </>
    )
}

Form.propTypes = {
    sectionName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultValues: PropTypes.object,
    formFields: PropTypes.array,
    dynamicFields: PropTypes.array,
    onSubmit: PropTypes.func.isRequired
}

export default Form