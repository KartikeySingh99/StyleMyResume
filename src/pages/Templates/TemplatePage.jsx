import TemplatePreview from "../../components/Template/TemplatePreview"

const TemplatePage = () => {
    return (
        <>
            <div className='w-full min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 items-start justify-items-center py-6  my-16'>
                <TemplatePreview />
            </div>
        </>
    )
}

export default TemplatePage