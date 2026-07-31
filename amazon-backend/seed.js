import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { products } from '../frontend/data/products.js';

dotenv.config();


const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


for(const product of products){
    await db.query(`insert into products 
                   (id,name,image,price_cents,rating_stars,rating_count,keywords,type,size_chart_link)
                   values 
                   (?,?,?,?,?,?,?,?,?)`,
                   [
                    product.id,
                    product.name,
                    product.image,
                    product.priceCents,
                    product.rating.stars,
                    product.rating.count,
                    JSON.stringify(product.keywords),
                    product.type || null,
                    product.sizeChartLink || null
                   ]
                   
    );
}

console.log("shit is uploaded");

await db.end();