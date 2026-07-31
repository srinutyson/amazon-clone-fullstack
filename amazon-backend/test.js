import jwt from 'jsonwebtoken';
const secret = "mysecretkey";
const token = jwt.sign(
    {id : 5},
    secret
);
console.log(token);