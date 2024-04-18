const AmiiboSearchUI = ({ term, setTermFunc, searchFunc, callbackFunc }) => {
    return <>
        <button onClick={() => { searchFunc(term, callbackFunc) }}>Search</button>
        <label>
            Name:
            <input value={term} onChange={e => setTermFunc(e.target.value.trim())} />
        </label>
    </>;
};

export default AmiiboSearchUI;