import React, {Fragment, useState, useEffect, useContext, useRef} from "react";
import Axios from "axios";
import numbro from "numbro";
import EditCar from "./EditCar";
import "./style.css";
import UserContext from "../context/UserContext";



const ListCars = ()=> {




    const [cars, setCar] = useState([{

        model: "",
        make: "",
        mileage: "",
        year: "",
        price: 0,
    }]);

    //here we saving the list of all the currency
    const [currencyList, setCurrencyList] = useState([]);

    const[rateValues, setRateValues] = useState({});

    //delete car from the list
    const deleteCar = async (id)=>{
        try{

            await fetch(`http://localhost:5000/cars/${id}`,{
                method: "DELETE"
            });
            setCar(cars.filter(car => car.car_id !== id));
        }catch (err) {
            console.error(err.message);
        }
    }
    const getCars = async () => {

        try{
            /**here is where we take the user token from the local storage.
             *it is created when we render the application for the first time
             *
             * i tried to retrieve the data from the useContent {const {useData, setUserData = useContext(UserContext)}} but it was not working:
             * i assume it is because of the useEffect. Because when i receive the context and log it in
             * i can se the token. but when i call the getCars function from useEffect and log the context it is coming as undefined.
             * yet when i call this function from a click or change the context is logging data.
             *
             * this is something i am yet to learn how to handle useEffect properly.
             * **/
            const token = localStorage.getItem("auth-token");

            /**in order to list the car of the current logged in user need to send the request with the user token.**/
            const response = await Axios.get("http://localhost:5000/cars", {
                headers:{
                    "x-auth-token": token,
                }});
            const jsonData = response.data;
           setCar(jsonData);
        }catch (err) {
            console.log(err.message);
        }
    };




    /**on the rendering useEffect is execute and get the list of the user cars and the currency list**/
    useEffect(()=>{
        getCars();

     }, []);

    useEffect(()=>{

        getRate();
    }, []);


    /**
     * HERE IS THE API FOR THE EXCHANGE RATE
     *
     * THIS FUNCTION IS CALLED AS SOON AS THE COMPONENT IS RENDERED BY THE useEFFECT
     *
     * **/
    const getRate= async (price)=> {

        try{

            const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.exchangeratesapi.io/latest?base=CAD`);
            const data = await  res.json();
            const currencyList = Object.keys(data.rates);
            const rates =data.rates ;
            setCurrencyList(currencyList);

            setRateValues(rates);



        }catch (err) {
            console.log(err.message);
        }

    }

    /**
     * THIS FUNCTION IS CALLED WHEN THE USER CHANGES THE CURRENCY
     *
     * THE NEW CURRENCY IS CALCULATED AND IT IS SENT HERE WITH THE ID OF WHERE THE CURRENCY IS CHANGED TO UPDATE THAT SPECIFIC DOM ELEMENT
     *
     * **/
    const renderNewCurrencyToTheDom = (car_id, newCurrency)=> {

       const elementIndex =  cars.findIndex(car => {
           return car.car_id === car_id;
       });

       /**
        * HERE WE SELECT ALL THE PRICE ELEMENT IN THE UI
        * **/
        const select = document.querySelectorAll(".price");

        /**
         * HERE WE SELECT A SPECIFIC PRICE ELEMENT IN THE INDEX PASSED (elementIndex)
         *
         * AND IT WILL UPDATE THAT SPECIFIC PRICE ELEMENT. WITHOUT THIS ALL THE PRICE ELEMENT WILL BE UPDATED.
         * **/
        select[elementIndex].textContent = newCurrency;



    }






    /**DOM**/
    return <Fragment>
        <div className="container" id="myClass">

        <div className="title">
            <h1>Car List</h1>
        </div>

        {

            cars.map(car =>(

                <div className="container car-detail" key={car.car_id} >


                    <div className="row mt-3">
                        <div className="col-md-8 col-sm-8 col-xs-2">
                            <div className="row justify-content-md-center" >
                                <p className="car-make">{car.make}</p>
                            </div>
                            <div className="row " >
                                <span className="material-icons">
                                directions_car
                                </span>
                                <p className="car-model details">{car.model}</p>
                            </div>
                            <div className="row " >
                                <span className="material-icons">
                                schedule
                                </span>
                                <p className="car-mileage details">{numbro(parseFloat(car.mileage)).format({thousandSeparated: true,
                                    mantissa: 2})} km</p>
                            </div>
                            <div className="row " >
                                <span className="material-icons">
                                event
                                </span>
                                <p className="car-year details "  id="price">{car.year}</p>

                            </div>
                            <div className="row mb-1" >
                                <EditCar cars={car}/>
                                <span>
                                    <button type="submit"
                                            className="btn btn-danger delete"
                                            onClick={()=> deleteCar(car.car_id)}>Delete</button>

                                </span>

                            </div>



                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-2">
                            <div className="row">
                                <div className="col-sm-6 col-xs-4">

                                <div className="row mr-5">
                                        <p className="car-price details price" >{numbro(car.price).format({thousandSeparated: true,
                                            mantissa: 2})}</p>

                                    </div>

                                </div>
                                <span className="col-xs-4">

                                    <select className="btn btn-light" onChange={(e)=> {
                                        const rates = rateValues[e.target.value]
                                        const newCurrency = car.price * rates;
                                        /**
                                         * HERE WE USE THE NUMBRO LIBRARY TO FORMAT OUR NUMBER
                                         * **/
                                        const formattedNumber = numbro(newCurrency).format({thousandSeparated: true,
                                            mantissa: 2});
                                        renderNewCurrencyToTheDom(car.car_id, formattedNumber);

                                    }}>

                                        {
                                            currencyList.map(item =>(
                                                <option value={item}>{item}</option>
                                             ))


                                        }
                                </select>
                                </span>

                            </div>


                        </div>
                    </div>

                </div>

            ))

        }

        </div>
    </Fragment>;
}

export default ListCars;