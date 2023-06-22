const whiteList = [
  "http://127.0.0.1:5173/",
  "http://localhost:3000",
  "http://localhost",
  "http://0.0.0.0",
  "http://127.0.0.1:5173",
];

//cors options
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed!!!"));
    }
  },
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
