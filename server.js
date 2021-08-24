/**
 * I HAVE USED TWO METHOD TO CREATE THE DATABASE.
 * FOR THE CAR DATABASE I CREATED THE DATABASE AND DEFINED IT USING THE SQL COMMAND LINE.
 * FOR THE USER DATABASE I HAVE USED A DATABASE MODEL USING SEQUELIZE TO CREATE AND DEFINE.
 *
 * I WAS LEARNING THE DIFFERENT WAY TO INTERACT WITH THE DATABASE. HENCE I HAVE USED THE TWO METHODS.
 *
 * **/





const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const path = require("path")

const app = express();
app.use(bodyParser.urlencoded({extended: false}));


/**middleware**/
app.use(cors());

//getting the data from the client side//
app.use(express.json()); //req.body

/**ROUTES**/
//app.use(express.static("client-side/build"))

if(process.env.NODE_ENV === "production"){
    app.use(express.static("/client-side/build"))
} 


console.log(__dirname)
/**CAR DATABASE**/


/**CREATE/ADD A CAR**/
app.post("/cars", async (req, res) => {
    try {


        const user_id = await User.findByPk(checkToken(req, res));

        const sql = "INSERT INTO car (model, make, mileage, year, price, user_id) VALUES($1, $2, $3, $4, $5, $6) returning * ";
        const params = [req.body.model, req.body.make, req.body.mileage, req.body.year, req.body.price, user_id.user_id ];
        const newCar = await pool.query(sql, params);
        res.json(newCar.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

/**GET ALL CARS**/
app.get("/cars", async (req, res) => {

    try {
        const user_id = await User.findByPk(checkToken(req, res));

        const sql = "SELECT * FROM car where user_id = $1";
        const params = [user_id.user_id];
        const allCars = await pool.query(sql, params);
        res.json(allCars.rows);
    } catch (err) {
        res.status(400).json(err.message);

    }
});

/**GET A CAR**/
app.get("/cars/:id", async (req, res) => {
    try {
        const sql = "SELECT * FROM car WHERE car_id =$1"
        const params = [req.params.id];
        const car = await pool.query(sql, params);
        res.json(car.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

/**UPDATE A CAR**/
app.put("/cars/:id", async (req, res) => {
    try {
        const sql = "UPDATE car SET model=$1, make=$2, mileage=$3, year=$4, price=$5 WHERE car_id = $6";
        const params = [req.body.model, req.body.make, req.body.mileage, req.body.year, req.body.price, req.params.id];
        const updateCar = await pool.query(sql, params);
        res.json("To do was updated");
    } catch (err) {
        res.status(400).json(err.message);
    }
})

/**DELETE A CAR**/
app.delete("/cars/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM car WHERE car_id = $1 returning *"
        const params = [req.params.id];
        const deletedCar = await pool.query(sql, params);
        res.json(`the make ${deletedCar.rows[0].make} has been deleted`);
    } catch (err) {
        res.status(400).json(err.message);
    }
});









/**USER DATABASE**/




/**USER ROUTER**/

/**this is used to register the user**/
app.post("/users/register", async (req, res) => {
    try {


        let {email, password, passwordCheck, displayName} = req.body;

        //VALIDATION
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({msg: "Not all fields have been entered"});
        }
        if (password.length < 5) {
            return res.status(400).json({msg: "Password needs to be at least 5 characters long"});

        }

        if (password !== passwordCheck) {
            return res.status(400).json({msg: "Entered the same password twice for verification"});

        }

        const existingUser = await User.findOne({where:{email: email}});
        if (existingUser) {
            return res.status(400).json({msg: "An account with this email already exists."});

        }
        if (!displayName) {
            displayName = email;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
      

        const newUser = new User({
            email,
            password: passwordHash,
            displayName,
        })
        const saveUser = await newUser.save();
        res.json(saveUser);
    } catch (err) {
        res.status(400).json(err.message);
    }
});


/**this is used to login the user**/
app.post("/users/login", async (req, res)=>{
    try{
        const {email, password} = req.body;

        //validate
        if(!email || !password){
            return res.status(400).json({msg: "Not all fields have been entered."})
        }

        const user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(400).json({msg: "No account with this email has been registered"});

        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials."});

        }

        /**the code below create the user token. and the User ID is attached to it**/
        const token = jwt.sign({id:user.user_id}, process.env.JWT_SECRET);
       

        /**here we do not return the password for security
         *
         * we could also avoid to return the email. it is subjective
         * **/
        res.json({
            token,
            user: {
                id: user.user_id,
                displayName: user.displayName,
                email: user.email,
            },
        });

    }catch (err) {
        res.status(400).json(err.message);
    }
});


/**we want to check whether the user token is valid**/
app.post("/users/tokenIsValid", async (req, res) => {
    try{

        /**the checkToken is the function which actually checks the token
         * since it is used in multiple request. i have created a function
         * which return the user ID that we need here.
         * **/

        const user = await User.findByPk(checkToken(req, res));
       
        if(!user){
          
            return res.json(false);
        }

        return res.json(true);
    }catch (err) {
        res.status(400).json(err.message);
    }
})

app.get("/users",  async(req, res)=>{
    // const user = await User.findByPk(req.user);
    // res.json(user);

    try{
        const user = await User.findByPk(checkToken(req, res));



        res.json({
            displayName: user.displayName,
            id: user.user_id,
        });
    }catch (err) {
        res.status(400).json(err.message);
    }
});


/**this function is called to check the user token and return the id of the user
 * and the id is used to identify the user who is currently log in.
 **/
const checkToken = (req, res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token){
            return res.json(false);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified){
            return res.json(false);
        }
       return verified.id;


    }catch (err) {
       res.json(err.message);
    }

}

//can be handled in the front end.
app.get("*", (req, res)=> {
    console.log("random path")
    res.sendFile("client-side/build/index.html")
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listen to port ${port}`);
})