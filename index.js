const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog.model")

const userRoute = require("./routes/user.route")
const blogRoute = require("./routes/blog.route")

const { checkForAuthenticationCookie } = require("./middlewares/authentication.middleware")
const exp = require("constants")

const app = express()
const PORT = 8000

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(e=>console.log('MongoDB connnected'))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended : false}))
app.use(express.json())
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})


app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))