

const express = require("express");
const router = express.Router();


const {
  signUpViaEmail,
  signInViaEmail,
  viaGoogle,
  getUserMe,
  getAllUsers,
} = require("../controllers/userControllers");


const verifyToken = require('../middleware/verifyToken');


router.post("/signup", signUpViaEmail);


router.post("/google", viaGoogle);


router.get("/me", verifyToken, getUserMe);


router.get("/allUsers", getAllUsers);


router.post("/signin", verifyToken, signInViaEmail);

module.exports = router;
