

const InputRadioCart = ({ id, name, checked, onChange, label }) => {

    return (
        <div
            onClick={onChange}
            className="flex items-center gap-3 border-2 border-gray-300 p-3 rounded-md cursor-pointer">
            <input
                checked={checked}
                onChange={onChange}
                type="radio"
                name={name}
                id={id} />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

export default InputRadioCart;