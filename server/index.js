const express = require("express")
const cors = require("cors")
const app = express()
const AuthRouter = require("./routes/auth")
const ProfileRouter = require("./routes/profile")
const SearchRouter = require("./routes/search")
const ProjectRouter = require("./routes/project")

app.use(cors())
app.use(express.json());
app.use("/auth", AuthRouter)
app.use("/profile", ProfileRouter)
app.use("/search", SearchRouter)
app.use("/project", ProjectRouter)
app.get("/", (req, res) => res.send("Hello"))
app.listen(4000, () => {
    console.log("http://localhost:4000")
})