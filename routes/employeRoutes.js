const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../middlewares/auth")
const {
        homepage,
        employesignup,
        employesignin,
        employesignout,
        currentEmploye,
        createtask,
        readtasks,
        readsingletask,
        deletetask,
        updatetask
      } = require("../controllers/employeController")

// post / 
router.post("/", homepage)


router.post("/employe", isAuthenticated  ,currentEmploye)

// Post /signup
router.post("/employe/signup" , employesignup )

// Post /signin
router.post("/employe/signin" , employesignin  )

// Get /signout
router.get("/employe/signout", isAuthenticated , employesignout  )

// -------------------------- task routes ------------------------------

// post /task/create
router.post("/employe/task/create/", isAuthenticated , createtask )

// post /task/read
router.post("/employe/task/read", isAuthenticated , readtasks )

// post /task/read/:id
router.post("/employe/task/readsingle/:id", isAuthenticated , readsingletask )

// post /task/update/:id
router.post("/employe/task/update/:id", isAuthenticated , updatetask )

// post /task/delete/:id
router.post("/employe/task/delete/:id", isAuthenticated , deletetask )

module.exports = router