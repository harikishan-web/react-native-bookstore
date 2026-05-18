// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const protectRoute = async (req, res, next) => {
//   try {
//     // get token
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token)
//       return res
//         .status(401)
//         .json({ message: "Unauthorized, no token provided" });

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // find user
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user)
//       return res
//         .status(401)
//         .json({ message: "Token is invalid, user not found" });

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("Authentication error", error.message);
//     res.status(401).json({ message: "Token is invalid" });
//   }
// };

// export default protectRoute;

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    console.log("=== AUTH START ===");

    const authHeader = req.header("Authorization");

    console.log("AUTH HEADER:", authHeader);

    const token = authHeader?.replace("Bearer ", "");

    console.log("TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN");

      return res.status(401).json({
        message: "Unauthorized, no token provided",
      });
    }

    console.log("BEFORE VERIFY");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    console.log("BEFORE FIND USER");

    const user = await User.findById(decoded.userId).select("-password");

    console.log("USER:", user);

    if (!user) {
      console.log("USER NOT FOUND");

      return res.status(401).json({
        message: "Token invalid, user not found",
      });
    }

    req.user = user;

    console.log("AUTH SUCCESS");

    next();
  } catch (error) {
    console.log("AUTH ERROR FULL:", error);

    res.status(401).json({
      message: error.message,
    });
  }
};

export default protectRoute;
