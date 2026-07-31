import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
let db;
try {
    db = await mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    database : process.env.DB_NAME,
    password : process.env.DB_PASSWORD
})
console.log("this connection pool is working ")
}
catch(err){
    console.error("database connection failed :",err);
}

export default db;