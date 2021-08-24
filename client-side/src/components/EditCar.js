import React, {Fragment, useState} from "react";
import "./style.css"
const EditCar = ({cars})=> {
    const [car, setCar] = useState({
        model: cars.model,
        make: cars.make,
        mileage: cars.mileage,
        year: cars.year,
        price:cars.price,

    });


    const updateCar = async (e)=>{

        e.preventDefault();

        try{
            const response = await fetch(`/cars/${cars.car_id}`,{
                method: "PUT",
                headers:{"content-Type": "application/json"},
                body: JSON.stringify(car)
            });
            alert(`The ${cars.make} ${cars.model} has been successfully updated`);
            window.location ="/carList";

        }
        catch (err) {
            console.log(err.message);
        }
    }

    /**edit description function**/
    const enterCarDetails = e  => {

        setCar(
            {
                ...car,
                [e.target.name]: e.target.value
            }
        )

    }
    return <Fragment>


        <button type="button" className="btn btn-light edit mr-1" data-toggle="modal" data-target={`#id${cars.car_id}`}>
            Edit
        </button>


        {/**
            THE USE OF id={`id${cars.car_id}`} IS TO HELP THE MODAL TO DISPLAY THE CORRENT DATA WHEN YOU CLICK THE EDIT BUTTON
         **/}
        <div className="modal" id={`id${cars.car_id}`}>
            <div className="modal-dialog">
                <div className="modal-content">


                    <div className="modal-header">
                        <h4 className="modal-title">Edit car details</h4>
                        <button type="button" className="close" data-dismiss="modal" >&times;</button>
                    </div>


                    <div className="modal-body">
                        <div className="container" >

                            <div className="row align-items-start">


                                <div className="col-md-12" >
                                    <form method = "get" action="ListCar.js" >
                                        <div className="form-group">
                                            <label htmlFor="usr">Make:</label>
                                            <input type="text" className="form-control" id="make" name="make" value={car.make} onChange={enterCarDetails}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pwd">Model:</label>
                                            <input type="text" className="form-control" id="model" name="model" value =  {car.model} onChange={enterCarDetails}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pwd">Mileage:</label>
                                            <input type="text" className="form-control" id="mileage" name="mileage" value =  {car.mileage} onChange={enterCarDetails}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pwd">Year:</label>
                                            <input type="text" className="form-control" id="year" name="year" value =  {car.year} onChange={enterCarDetails}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pwd">Price:</label>
                                            <input type="number" className="form-control" id="price" name="price" value =  {car.price} onChange={enterCarDetails}/>
                                        </div>

                                        <button type="button"
                                                className="btn btn-primary"
                                                data-dismis = "modal"
                                                onClick={(e) => updateCar(e)}>
                                            Edit
                                        </button>

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
    </Fragment>
};

export default EditCar;