const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { fileURLToPath } = require("url");
const router = require("./routes/routes");
const postRouter = require("./routes/postRoutes");
const customError = require("./middleware/customErrorHandler");
const bodyParser = require("body-parser");
const connectDB = require("./DB/connect");
const rateLimit = require("express-rate-limit");
const corsOption = require("./Cors/coresOptions");

//populate dB
const { users, posts } = require("./index");
const Users = require("./model/Users");
const post = require("./model/post");

app.use(cors());
//app.set("trust proxy", 1);
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   })
// );

//static middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", router);
app.use("/user", postRouter);
app.use(customError);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("db connection sucess!");
    app.listen(PORT, () => {
      console.log(`server is running at PORT: ${PORT}...`);
    });

    // Users.insertMany(users);
    // post.insertMany(posts);
  } catch (error) {
    console.log(`could not start up server ${error}: occured`);
  }
};

start();
