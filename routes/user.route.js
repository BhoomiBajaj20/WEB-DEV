const { Router } = require("express")
const User = require("../models/user.models")
const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.post('/signin', async(req, res) => {

    const {email, password} = req.body
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password)
        return res.cookie('token', token).redirect('/')
    }catch(err){
        console.error("Signin error", err)
        return res.render('signin',{ 
            error: "Incorrect email or password"
        })
    }
    // const {email, password} = req.body
    // const token = await User.matchPasswordAndGenerateToken(email, password)

    // console.log('User', token)
    // return res.cookie('token', token).redirect('/')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password} = req.body

    await User.create({
        fullName,
        email,
        password
    })

    return res.redirect('/')
})

module.exports = router