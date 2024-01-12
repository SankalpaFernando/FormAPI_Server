const express = require("express");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authentication");
const projectRouter = require("./routes/project");
const collectionRouter = require("./routes/collection");
const dataRouter = require("./routes/data");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("cookie-session");

require("dotenv").config();


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));
app.use(session({
    secret: "Hello", 
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    // cookie: {
    //     secureProxy: true,
    //     httpOnly: true,
    //     domain: 'example.com',
    // }
}));
app.use(authRouter);
app.use('/project',projectRouter);
app.use('/collection',collectionRouter);
app.use('/data',dataRouter);


const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

