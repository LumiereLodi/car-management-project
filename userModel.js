/**
 * in this file we create the database for the USERS and define it.
 * and also create a connexion that we use every time we want to interact with the database
 *
 * **/

const DataTypes = require( "sequelize").DataTypes;
const Sequelize = require("sequelize");


/**CREATING A CONNEXION**/
const sequelize = new Sequelize('cars', 'postgres','lumiere', {

    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
} );


/**DEFINING THE DATABASE TABLE**/
const User = sequelize.define('userinfos', {
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    } ,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    passwordCheck: Sequelize.STRING,
    displayName: Sequelize.STRING,
})

try{


User.sync();
}
catch (err) {
    console.log(err.message);
}



module.exports = User;




