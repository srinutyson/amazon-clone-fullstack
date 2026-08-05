import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import cors from 'cors';
import bcrypt from 'bcrypt'
import { Connection } from 'mysql2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { protect } from './middleware/auth.js';
dotenv.config();

const port   = process.env.PORT||3000;
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5500",
        "https://amazon-clone-fullstack-theta.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
app.use(logger);
app.get('/api/profile', protect, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, name, email
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post('/api/signup',async(req,res) =>{
     const {name,email,password} = req.body;
    try{
        const [rows] = await db.query(`select * from users where email = ?`,[email]);
     if(rows.length >0){
       return  res.status(400).json({
            message : "email already exists"
        });
     }
     const hashedpassword = await bcrypt.hash(password,10);
  const [result] =   await db.query(`insert into users(name,email,password)
                                     values(?,?,?)`,[name , email , hashedpassword]);
    const token = jwt.sign(
        {
            id: result.insertId
        },
        
            process.env.JWT_SECRET,
            {
                expiresIn : "30d"
            }

        
    )
            res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000
});
            res.status(201).json({
            message: "user created successfully",
            token
        });
  
    }
    catch(err){
          console.error(err);
             res.status(500).json({message : 'Internal server error'});
    }

});
app.post('/api/login',async (req,res) =>{
    try{
        const { email , password} = req.body;
    const [rows]= await db.query(`select * from users where email = ?`,[email]);
    if(rows.length === 0){
        return res.status(400).json({
            message : "invalid email or password"
        })
    }
    const user = rows[0];
    const ismatch = await bcrypt.compare(password,user.password);
    if(!ismatch){
         return res.status(400).json({
            message : "invalid email or password"
        });
    }

     const token  = jwt.sign(
        {
            id : user.id
            
        },
        process.env.JWT_SECRET,
        {
            expiresIn : "30d"
        }

     );
res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000
});


     res.status(200).json({
        message : "login succesful"
     });
    }
    catch(err){
        console.error(err);
             res.status(500).json({message : 'Internal server error'});
    }



});

app.get('/api/products' , async (req,res) =>{
     const {search}  = req.query;
        try{
            let result;
          if(!search) {
            const [temp] = await  db.query('select * from products');
            result = temp;
          }
          else {
            const [temp] = await db.query(`select * from products where name like ?`,[`%${search}%`])
             result = temp;
          } 
            const products = result.map(product =>{

                return {
                    id : product.id,
                    name : product.name,
                    image : product.image,
                    priceCents : product.price_cents,
                    rating : {
                        stars : product.rating_stars,
                        count : product.rating_count
                    },
                    keywords : product.keywords,
                    type : product.type,
                    sizeChartLink : product.size_chart_link
                }
        });
            res.json(products);
        }
        catch(err){
            console.error(err);
             res.status(500).json({message : 'Internal server error'});
        }
});

app.get('/api/cart' ,protect,  async(req,res) =>{
         
         try{
            const userid = req.user.id;
            const [cart] = await db.query(`select 
                                        p.id,
                                        p.name,
                                        p.image,
                                        p.price_cents,
                                        p.rating_stars,
                                        p.rating_count,
                                        c.quantity,
                                        c.deliveryoption
                                        from cart as c
                                        join products as p
                                        on c.product_id = p.id 
                                        where c.user_id = ? `,[userid]);
                res.json(cart);
         }
         catch(err){
            console.error(err);
            res.status(500).json({message : 'internal server error'});
         }
});

app.delete('/api/cart/:productid',protect , async(req,res) =>{
      

      try{
        const userid = req.user.id ;
      const productid = req.params.productid;
         await db.query(`delete from cart
                         where user_id = ? and 
                         product_id = ?`,[userid,productid]);
        res.status(200).json({message : 'product successfully deleted '});
      }
      catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }
});
app.patch('/api/cart/:productid',protect,async(req,res)=>{


      try{
         const userid = req.user.id ;
      const productid = req.params.productid;
      const doption = req.body.deliveryoption;
        await db.query(`update cart
                        set deliveryoption = ?
                        where user_id = ?
                        and product_id = ? `,[doption,userid,productid]);
        res.status(200).json({message : 'product successfully updated '});
      }
      catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }

});
app.post('/api/cart',protect,async (req,res) =>{
    

  
    try{
         const userid = req.user.id 
    const {prodid,quantity} = req.body;
         const [rows] = await db.query(`select quantity
                                        from cart
                                        where user_id = ? and 
                                         product_id = ?`,[userid,prodid]);
         if(rows.length>0){
           await db.query(`update cart
                           set quantity = quantity+?
                           where user_id = ? and product_id = ?`,[quantity,userid,prodid]);
         }
         else {
             await db.query( `insert into cart (user_id,product_id,quantity,deliveryoption)
                              values(?,?,?,?)`,[userid,prodid,quantity,1]);
         }
         res.status(201).json({message : 'product added successfully'});
        
    }
    catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }
})
app.patch('/api/cart/:productid/quantity',protect,async(req,res)=>{
    
    try{
        const {productid} = req.params;
    const {c} = req.body;
    const userid = req.user.id;
        await db.query(`update cart
                  set quantity = quantity+?
                  where user_id = ? and product_id = ?`,[c,userid,productid]);
                 

        await db.query(`delete from cart
                         where quantity = ? and user_id = ? and product_id = ?`,[0,userid,productid]);
                           res.status(200).json({message : 'product added successfully'});
    }
     catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }
});
app.post('/api/orders',protect,async(req,res) =>{
     const connection = await db.getConnection();
        await connection.beginTransaction(); 
      try{
         const userid = req.user.id;
      
      const [result] = await connection.query(
          `insert into orders(user_id,order_date)
           values (?,now())`,[userid]
      );
      const orderid = result.insertId;
      const [cartitems] = await connection.query(`
                                            select * 
                                             from cart
                                             where user_id = ?`,[userid]);
      for(const item of cartitems){
        await connection.query(`insert into order_items(order_id,product_id,quantity,deliveryoption)
            values(?,?,?,?)`,[orderid,item.product_id,item.quantity,item.deliveryoption]);
      }
      await connection.query(`DELETE FROM cart
                               WHERE user_id = ?`,[userid]);
     await connection.commit();
     res.status(201).json({
      orderId : orderid
});
      }
      catch(err){
        await connection.rollback();

        console.error(err);
        res.status(500).json({message :'internal server error'})
      }
      finally{
        connection.release();
      }
});
app.get('/api/orders',protect , async (req,res) =>{
   

     try{
         const userid = req.user.id;
         const [orders] = await db.query(`select 
                    o.id as order_id,
                    o.order_date,
                    oi.quantity,
                    oi.deliveryoption,
                    oi.product_id,
                    p.name,
                    p.image,
                    p.price_cents
                from orders as o
                join order_items as oi on o.id = oi.order_id
                join products as p on oi.product_id = p.id
                where o.user_id = ?;`,[userid]);
    res.json(orders);
     }
      catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }
  
});
app.get('/api/orders/:orderid/products/:productid',protect,async(req,res) =>{
    
    try{
        const {orderid,productid} = req.params;
        const userid = req.user.id;
         const [row] = await db.query(`select 
                                                    o.order_date,
                                                    oi.quantity,
                                                    oi.deliveryoption,
                                                    p.name,
                                                    p.image
                                                from orders as o
                                                join order_items as oi on o.id = oi.order_id
                                                join products as p on oi.product_id = p.id
                                                where o.id = ? and oi.product_id = ?
                                                and user_id = ?;
`,[orderid,productid,userid]);
            if (row.length === 0) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json(row[0]);
    }
    catch(err){
        console.error(err);
            res.status(500).json({message : 'internal server error'});
      }
});
app.post('/api/logout',(req,res) =>{
    res.clearCookie("jwt", {
    secure: true,
    sameSite: "none"
});
    res.status(200).json({
        message : "logged out successfully"
    });
})
app.listen(port ,()=>{
    console.log(`server is running ${port}`);
})


