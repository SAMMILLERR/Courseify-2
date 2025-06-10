import jwt from 'jsonwebtoken';

export const adminmiddleware = (req, res, next) => {
    //dddddconsole.log("inside");
    console.log(process.env.JWT_ADMIN_SECRET);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or bad Authorization format' });
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    console.log(payload.adminId);
    req.adminId = payload.adminId ;
    


    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
