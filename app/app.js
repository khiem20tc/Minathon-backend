import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join, resolve } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import mountRoutes from "./routes";
// import { winston } from "./config";
// import { apiError } from "./helpers";

//const { not_found } = apiError;

let app = express();

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  logger("combined", {
    stream: {
      write: function (message) {
        console.log(message);
      },
    },
  })
);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json({ limit: "20mb" }));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.get("/favicon.ico", (req, res) => res.status(204));

mountRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.message === "Not Found") {
    // return res.status(404).json(not_found.withDetails("Path not found."));
	return res.status(404).json("Path not found")  
}

  // log error
  let errToLog = err.realError ? err.realError : err;
  let errToReturn = err.realError ? err.userError : err;

  console.log("ERROR:", errToLog);
  console.log(
    `${errToLog.message}
    STACK: ${errToLog.stack}
    Header: ${JSON.stringify(req.headers)}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Return to user: ${JSON.stringify(errToReturn)}`
  );

  const status = errToReturn.code / 100;
  return res.status(status).json({
    error: errToReturn,
  });
});

export default app;
