/**
 * ASSUMPTIONS: SINCE I HAVE NOT IMPLIMENTED THE LOGGIN YET I WILL WRITE SOME ASSUMPTIONS BELOW
 * the user will not be able to add any car if they havent logged in.
 **/


import React, {Fragment, useState,useContext} from "react";
import UserContext from "../context/UserContext";

import "./style.css"

const HomePage = ()=> {

    const {userData, setUserData} = useContext(UserContext);


    const [car, setCar] = useState({
        model: "",
        make: "",
        mileage: "",
        year: "",
        price: 0,

    });
    const enterCarDetails = e  => {

        setCar(
            {
                ...car,
                [e.target.name]: e.target.value
            }
        )

    }

    const onSubmitForm = async e =>{
        e.preventDefault();

        /**
         * WE WILL NOT ALLOW USER TO SAVE A CAR WITH EMPTY FIELD. THEY NEED TO FEEL EVERYTHING
         * **/
        if(car.year === "" || car.mileage ==="" || car.make==="" || car.model === "" || car.price ===0){
            alert("You have one or more fields empty. Fill all fields");
        }

        /**
         * THEY WONT BE ABLE TO ENTER NEGATIVE PRICE BECAUSE IT DOESNT MAKE SENSE TO HAVE A NEGATIVE PRICE
         * **/
        else if (car.price < 0){
            alert("The price cannot be negative")
        }
        else {
            try{

                /**SENDING DATA TO OUR SERVER TO SAVE INTO THE DATABASE
                 * WE ARE USING RESTFUL API
                 *
                 * We want to save the data in the car tale with the userID
                 * so that when they log in we will retrieve only his data
                 * for the we need to pass the user token which can be found in the context API
                 *
                 * the variable userData is holding the user information and the user token.
                 * **/
               await fetch("/cars", {
                    method: "POST",
                    headers:{
                        "content-Type": "application/json",
                        "x-auth-token": userData.token,
                        },
                    body: JSON.stringify(car)
                });

                alert(`The ${car.make} ${car.model} has been successfully added`);


                /**THIS IS TO ALLOW THE PAGE TO RELOAD AFTER WE HAVE SUBMITTED OUR CAR DETAILS**/
                window.location="/";
            }
            catch(err){
                console.log(err.message);
            }
        }

    }



        /**DOM**/
    return <Fragment>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="jumbotron">
                        <h2 className="display-4">Manage your cars easily and fast.</h2>
                        <hr className="my-4"/>
                        {
                            userData.user ? (

                                    <>
                                        <p>Enter your car details below</p>
                                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">
                                            Add new car
                                        </button>
                                    </>
                            ):(
                                <>
                                    <p>Login to add and save your Car</p>
                                </>
                            )

                        }

                    </div>
                </div>

            </div>

            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Enter Car Details</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="container" >

                                <div className="row">


                                    <div className="col-md-12" >
                                        <form method = "get" action="ListCar.js" onSubmit={onSubmitForm}>
                                            <div className="form-group">
                                                <label htmlFor="usr">Make:</label>
                                                <input type="text" className="form-control" id="make" name="make" value={car.make} key={1} onChange={enterCarDetails}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pwd">Model:</label>
                                                <input type="text" className="form-control" id="model" name="model" value =  {car.model} key={2} onChange={enterCarDetails}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pwd">Mileage:</label>
                                                <input type="text" className="form-control" id="mileage" name="mileage" value =  {car.mileage} key={3} onChange={enterCarDetails}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pwd">Year:</label>
                                                <input type="text" className="form-control" id="year" name="year" value =  {car.year} key={4} onChange={enterCarDetails}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pwd">Price:</label>
                                                <input type="number" className="form-control" id="price" name="price" value =  {car.price} key={5} onChange={enterCarDetails}/>
                                            </div>

                                            <button type="submit" className="btn btn-primary">Add</button>

                                        </form>


                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>



        </div>
    </Fragment>;
}

export default HomePage;