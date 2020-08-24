import React,{Fragment} from "react";


const ErrorNotice = props => {
    return <Fragment>

        <div className="error-notice">
            <span >{props.message}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={props.clearError}> X </button>
        </div>

    </Fragment>
}

export default ErrorNotice;