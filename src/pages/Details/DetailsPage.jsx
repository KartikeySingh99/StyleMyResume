import Details from "../../components/Form/Details";

const DetailsPage = () => {
    return (
        <>
            <div className="w-full min-h-screen flex items-center bg-gray-200">
                <Details actionType="create" />
            </div>
        </>
    )
}

export default DetailsPage;