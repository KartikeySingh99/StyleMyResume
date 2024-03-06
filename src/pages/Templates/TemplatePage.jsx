import Template from "../../components/Template/Template"

const TemplatePage = () => {
    return (
        <>
            <div className='w-full min-h-screen  my-16'>
                <div className='flex flex-wrap items-center justify-evenly gap-x-12 gap-y-4'>
                    {
                        new Array(2).fill().map((item, i) => (
                            <Template key={i} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default TemplatePage