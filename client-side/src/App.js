import React,{Fragment, useState, useEffect} from 'react';
import NavBar from "./components/Navbar";
import './components/style.css';
import Axios from "axios";


import './App.css';

/**COMPONENT**/
import ListCar from "./components/ListCar";
import HomePage from "./components/home";
import Login from "./components/Login";
import Register from "./components/Register";


/**CONTEXT**/
import UserContext from "./context/UserContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {

    const[userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(()=> {

        /**use effect cannot be async. hence the user of a nested function
         *
         * every time you reload the page this function will be called.
         *
         * the role of this function is to set the token to the local storage and
         * also set the header in the database to the current token.
         *
         * if no user is login when we restart nothing is added. the token will be empty.
         *
         *
         * **/

        const checkLoggedIn = async ()=> {
            let token = localStorage.getItem("auth-token");

            /**if no user is login when we restart nothing is added. the token will be empty.**/

            if(token ===null){
                localStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post("http://localhost:5000/users/tokenIsValid", null, {
                headers: {"x-auth-token": token}
            });
            if(tokenRes.data){
                const userRes = await Axios.get("http://localhost:5000/users", {
                    headers: {"x-auth-token": token},
                } );
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        }

        checkLoggedIn();
    }, []);
  return (

    <Fragment>

        <Router>
            <UserContext.Provider value={{userData, setUserData}}>
                <div className="container">
                    <div className="col-md-12">

                        <NavBar/>
                    </div>


                    <Switch>

                        <Route path="/" exact component={HomePage}/>

                        <Route path="/carList" component={ListCar}/>

                        <Route path="/Login" component={Login}/>

                        <Route path="/Register" component={Register}/>


                    </Switch>

                </div>
            </UserContext.Provider>



        </Router>

    </Fragment>

  );
}

export default App;
