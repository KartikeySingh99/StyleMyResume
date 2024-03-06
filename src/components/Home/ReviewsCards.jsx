import Rating from '@mui/material/Rating';

const ReviewsCards = ({ rating, name, review }) => {

    return (
        <>
            <div className='border border-gray-300 rounded-xl px-4 py-6 max-w-[28rem] h-[18rem] bg-primary/5'>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    readOnly
                    size='large'
                />
                <h1 className='text-xl font-bold my-2'>{name}</h1>
                <p className='text-md'>{review}</p>
            </div>
        </>
    )
}

export default ReviewsCards