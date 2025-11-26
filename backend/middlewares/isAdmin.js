import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    if (user.role !== "superadmin")
      return res.status(403).json({ message: "Access denied", success: false });
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAdmin;
// import { User } from "../models/user.model.js";

// const isAdmin = async (req, res, next) => {
//   try {
//     const userId = req.id;
//     if (!userId) {
//       return res
//         .status(401)
//         .json({ message: "User not authenticated", success: false });
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: "User not found", success: false });
//     }
//     if (user.role !== "superadmin") {
//       return res.status(403).json({ message: "Access denied", success: false });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default isAdmin;
