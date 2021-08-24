import React, {Fragment, useState,useContext} from "react";
import {Link} from "react-router-dom";
import Axios from "axios";
import {useHistory} from "react-router-dom";
import UserContext from "../context/UserContext";
import ErrorNotice from "../errors/ErrorNotice";
import "./style.css";


const Login = ()=>{
    const[email, setEmail] = useState();
    const[password, setPassword] = useState();

    const[error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async(e)=>{
        try {


            e.preventDefault();
            const loginUser = {email, password};
            const loginRes = await Axios.post("http://localhost:5000/users/login", loginUser);


            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });

            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/");
        }catch (err) {
            err.response.data.msg && setError(err.response.data.msg);

        }
    }
    return (
        <Fragment>
            <div className="container">


                <div className="row">
                    <div className="col-sm-8 col-md-8">
                        <div className="login">
                            <form onSubmit={submit}>
                                <div className="row justify-content-md-center form-title">
                                    <h1 >Login</h1>

                                </div>
                                {error && (
                                    <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
                                )}


                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input type="email" className="form-control email" id="email1"
                                           aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)}/>
                                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with
                                        anyone else.</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password1">Password</label>
                                    <input type="password" className="form-control" id="password1" onChange={(e)=>setPassword(e.target.value)}/>
                                </div>

                                <button type="submit" className="btn btn-primary">Log In</button>
                                <div className="mt-3">
                                    <Link to="/Register">
                                        <div>
                                            register?
                                        </div>
                                    </Link>
                                </div>


                            </form>
                        </div>

                    </div>

                </div>

            </div>

        </Fragment>
    );
}

export default Login;