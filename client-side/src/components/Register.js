import React, {Fragment, useState,useContext} from "react";
import Axios from "axios";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../context/UserContext";
import ErrorNotice from "../errors/ErrorNotice";

const Register = ()=>{


    const[email, setEmail] = useState();
    const[password, setPassword] = useState();

    const[passwordCheck, setPasswordCheck] = useState();

    const[displayName, setDisplayName] = useState();
    const[error, setError] = useState();

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    const submit = async(e)=>{
        try {


            e.preventDefault();

            /**Registering the user**/
            const newUser = {email, password, passwordCheck, displayName};
            await Axios.post("/users/register", JSON.stringify(newUser, null, 2), 
                {
                    headers: {
                        'Content-Type': "application/json"
                        
                    }
                }
            );


            /**when the user has registered we automatically log him/her in
             * tht is why we have the code below
             * **/
            const loginRes = await Axios.post("/users/login", {
                email,
                password,
            });

            /**and we directly update the token**/
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });

            /**and update the local storage. this local storage will be very helpful in order to retrieve the token**/

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
                    <div className="col-sm-12 col-md-12 col-xs">
                        <div className="login">
                            <form onSubmit={submit} className="col-sm-12 col-md-12 col-xs">
                                <div className="row justify-content-md-center form-title">
                                    <h1 >Register</h1>

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
                                <div className="form-group">
                                    <label htmlFor="passwordCheck">Confirm Password</label>
                                    <input type="password" className="form-control" id="passwordCheck" onChange={(e)=>setPasswordCheck(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passwordCheck">Username</label>
                                    <input type="text" className="form-control" id="passwordCheck" onChange={(e)=> setDisplayName(e.target.value)}/>
                                </div>

                                <button type="submit" className="btn btn-primary">Register</button>
                                <div className="mt-3">

                                    <Link to="/Login">
                                        <div>
                                            Have an account ? Go to login.
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

export default Register;