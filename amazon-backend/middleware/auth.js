// import jwt from 'jsonwebtoken';

// export function protect(req,res,next){
//     const token = req.cookies.jwt;
//     if(!token){
//        return  res.status(401).json({
//             message : "Not Authorised"
//         })
//     }
//     try{
//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     }
//     catch (err) {
//     return res.status(401).json({
//         message: "Invalid token"
//     });
// }
// }

export function protect(req, res, next) {

    console.log("Cookies:", req.cookies);

    const token = req.cookies.jwt;

    if (!token) {
        console.log("NO TOKEN");
        return res.status(401).json({
            message: "Not Authorised"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("TOKEN VERIFIED");
        req.user = decoded;
        next();
    } catch (err) {
        console.log("VERIFY ERROR:", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}