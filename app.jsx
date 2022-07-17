
const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: true,
        isError: false,
        data: initialData
    });

    useEffect(() => {
        console.log("The URL changed");
        let didCancel = false;
        const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
            const result = await axios(url);
            if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data});
            }
        } catch (error) {
            if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
            }
        }
        };
        fetchData();
        return () => {
        didCancel = true;
        };
    }, [url]);
    return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
switch (action.type) {
    case "FETCH_INIT":
    return {
        ...state,
        isLoading: true,
        isError: false
    };
    case "FETCH_SUCCESS":
    return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
    };
    case "FETCH_FAILURE":
    return {
        ...state,
        isLoading: false,
        isError: true
    };
    default:
    throw new Error();
}
};
function App() {
const { Fragment, useState, useEffect, useReducer } = React;
const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://excuser.herokuapp.com/v1/excuse",
    {
    hits: []
    }
);

const [category, setCategory] = useState("family");
const [isValid, setIsValid] = useState(true);
const [lastSended, setLastSended] = useState("");
    return (
    <Fragment>
        <div className="tarjeta">
            <form
                onSubmit={event => {
                    doFetch(`https://excuser.herokuapp.com/v1/excuse/${category}`);
                    setLastSended(category);
                    event.preventDefault();
                }}
            >
                <select onChange={event => {
                    setCategory(event.target.value);
                    if (event.target.value == lastSended){
                        setIsValid(false);
                    }else{
                        setIsValid(true);
                    }
                }}>
                    <option value="family">Family</option>
                    <option value="office">Office</option>
                    <option value="children">Children</option>
                    <option value="college">College</option>
                    <option value="party">Party</option>
                </select>
                <button type="submit" className="btn btn-success" disabled = {!isValid}>Get New Excuse</button>
            </form>

            {isError && <div>Something went wrong ...</div>}

            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <div className="resultado">{data[0].excuse}</div>
            )}
        </div>

    </Fragment>
);
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
