/**
 * He creates a token for each user to create a current sessionك
 *  meaning that he has permission to access some pages
*/ 
var jwt = require('jsonwebtoken');


module.exports = async(payload) =>{
    const my_token = await jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '10m' })
    return my_token;
};