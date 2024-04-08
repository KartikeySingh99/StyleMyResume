import TemplatePreview from "../../components/Template/TemplatePreview"

const TemplatePage = () => {
    return (
        <>
            <div className='w-full min-h-screen grid grid-cols-4 items-start justify-items-center py-6  border border-black my-16'>
                <TemplatePreview />
            </div>
        </>
    )
}

export default TemplatePage