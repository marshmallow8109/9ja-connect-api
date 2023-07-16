const whiteList = [
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost",
  "https://9jafriendify.netlify.app",
  "https://www.9jafriendify.netlify.app",
  "http://9jafriendify.netlify.app",
  "http://www.9jafriendify.netlify.app",
];

//cors options
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed!!! by cors"));
    }
  },
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
