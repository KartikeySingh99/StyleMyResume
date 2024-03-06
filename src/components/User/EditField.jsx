
const EditField = ({ edit, field, setData }) => {

    return (
        <>
            <div>
                <input type="text" className="text-xl font-bold text-center" name={field} value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            {/* <h1 onDoubleClick={() => handleEditable(field)} className="text-xl font-bold" onInput={handleInput}>{data}</h1> */}
        </>
    );
};

export default EditField;