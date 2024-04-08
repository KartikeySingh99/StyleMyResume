import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DialogPopup = ({ open, setOpen, children, width = 'md', padding = "12px", fullscreen = true }) => {

    const responsive = useMediaQuery('(max-width:428px)')

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth={responsive ? 'xl' : width}
                fullWidth={true}
                fullScreen={fullscreen ? responsive : false}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { borderRadius: responsive ? '0' : '12px', padding: "none" } }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent className="bg-white rounded-lg shadow-lg relative" sx={{ padding: responsive ? "8px 8px" : padding }}>
                    {children}
                </DialogContent>

            </Dialog>
        </>
    );
};

export default DialogPopup;