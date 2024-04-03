import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Points } from './Points';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions({ formData = {} }) {

    const { user } = useSelector((state) => state.user)

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    function analyzePoints(accordianName, data) {
        switch (accordianName) {
            case 'Structure':
                if ((data.section in formData) && formData[data.section] !== null) {
                    // console.log("section hai",data.section);
                    return (
                        <li className='flex items-start justify-start gap-x-2 py-2'><span className='text-emerald-500'><CheckCircleIcon fontSize='medium' /></span><span>{data.pointIdentified}</span></li>
                    )
                }
                else {
                    // console.log("section nhi hai",data.section);
                    return (
                        <li className='flex items-start justify-start gap-x-2 py-2'><span className='text-red-500'><CancelIcon fontSize='medium' /></span><span>{data.pointMustHave}</span></li>
                    )
                }
            case 'Contact Information':
                if (Object.entries(formData).length > 0 && formData[data.section][data.subSection] !== undefined) {
                    return (
                        <li className='flex items-start justify-start gap-x-2 py-2'><span className='text-emerald-500'><CheckCircleIcon fontSize='medium' /></span><span>{data.pointIdentified}</span></li>
                    )
                }
                else {
                    // console.log("subsection nhi hai");
                    return (
                        <li className='flex items-start justify-start gap-x-2 py-2'><span className='text-red-500'><CancelIcon fontSize='medium' /></span><span>{data.pointMustHave}</span></li>
                    )
                }
        }
    }

    return (
        <div>
            {
                Points.map((data) => (
                    <Accordion key={data.name} expanded={expanded === data.name} onChange={handleChange(data.name)}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>{data.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul className='list-inside'>
                                {
                                    data.points.map((point) => (
                                        analyzePoints(data.name, point)
                                        // user[point.section][point.subSection] !== undefined
                                        // ?
                                        // <li key={point.subSection}>{point.pointIndentified}</li>
                                        // :
                                        // <li key={point.section}>{point.pointMustHave}</li>
                                    ))
                                }

                            </ul>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div >
    );
}
