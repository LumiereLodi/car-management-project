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
const db = require("./db");
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
app.use(express.static("client-side/build"))

if(process.env.NODE_ENV === "production"){

    console.log("it is production")
    app.use(express.static("/client-side/build"))
} 

/**CAR DATABASE**/


/**CREATE/ADD A CAR**/
app.post("/cars", async (req, res) => {
    try {


        const user_id = await User.findByPk(checkToken(req, res));

        const sql = "INSERT INTO car (model, make, mileage, year, price, user_id) VALUES($1, $2, $3, $4, $5, $6) returning * ";
        const params = [req.body.model, req.body.make, req.body.mileage, req.body.year, req.body.price, user_id.user_id ];
        const newCar = await db.query(sql, params);
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
        const allCars = await db.query(sql, params);
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
        const car = await db.query(sql, params);
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
        const updateCar = await db.query(sql, params);
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
        const deletedCar = await db.query(sql, params);
        res.json(`the make ${deletedCar.rows[0].make} has been deleted`);
    } catch (err) {
        res.status(400).json(err.message);
    }
});









/**USER DATABASE**/




/**USER ROUTER**/

/**this is used to register the user**/
app.post("/users/register", async (req, res) => {
    


        let {email, password, passwordCheck, displayName} = req.body;

        //VALIDATION
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({msg: "All Field required"});
        }
        if (password.length < 5) {
            return res.status(400).json({msg: "Password needs to be at least 5 characters long"});

        }

        if (password !== passwordCheck) {
            return res.status(400).json({msg: "Passwords do not match"});

        }

        console.log("close to the the first request")
        /*
        const existingUser = await User.findOne({where:{email: email}});
        if (existingUser) {
            return res.status(400).json({msg: "An account with this email already exists."});

        }
        */    
       
        try {
        const result = await db.query("SELECT email from userinfos where email = $1", [email])
        console.log("passed the first request")
        if (result.rowCount !== 0) {
            return res.status(400).json({msg: "An account with this email already exists."});

        }
        if (!displayName) {
            displayName = email;
        }
    
        //const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, 10);
      
/*
        const newUser = new User({
            email,
            password: passwordHash,
            displayName,
        })
        */
        //const saveUser = await newUser.save();
        
        console.log(passwordHash)
        const response = await db.query("INSERT INTO userinfos(email, password, displayname) VALUES($1, $2, $3) RETURNING *", 
        
        [email, passwordHash, displayName]

        )
        console.log("end of the first request")
        res.json(response.rows[0]);
        console.log("passed the second request")
    } catch (err) {

        console.log("then went to error")
        res.status(400).json(err.message);
        console.log(err)
    }
});


/**this is used to login the user**/
app.post("/users/login", async (req, res)=>{
    try{
        const {email, password} = req.body;
        console.log("inside loggin")
        //validate
        if(!email || !password){
            return res.status(400).json({msg: "Not all fields have been entered."})
        }

        const user = await db.query("SELECT displayname, user_id, email from userinfos where email = $1 ", [email])
        
       
        if(user.rowCount === 0){
            return res.status(400).json({msg: "No account with this email has been registered"});

        }

        const dbPassword = await db.query("SELECT password FROM userinfos where email = $1", [email])
        const isMatch = await bcrypt.compare(password, dbPassword.rows[0].password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials."});

        }

        console.log(user)
        /**the code below create the user token. and the User ID is attached to it**/
        const token = jwt.sign({id:user.rows[0].user_id}, process.env.JWT_SECRET);
       

        /**here we do not return the password for security
         *
         * we could also avoid to return the email. it is subjective
         * **/

        console.log("after token creation")
        
        res.json({
            token,
            user: {
                id: user.rows[0].user_id,
                displayName: user.rows[0].displayname,
                email: user.rows[0].email,
            },
        });
        console.log("loggin worked")

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
    console.log("inside unknown")
    res.sendFile(path.join(__dirname, "client-side/build/index.html"))
    //console.log(path.join(__dirname, "client-side/build/index.html"))
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listen to port ${port}`);
})