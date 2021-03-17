import { connect } from "mongoose";
import app from "./app/app";
import { createServer } from "https";
import { readFileSync } from "fs";

require('dotenv').config()

connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false,
})
  .then(() => {
    console.log("MongoDB Connected ...");
  })
  .catch((err) => console.log(err));

let port = process.env.PORT || 5000;

let server = app;
if (process.env.NODE_ENV === "production") {
  // const httpsOptions = {
  //   key: readFileSync(
  //     "/etc/letsencrypt/live/api.credential.asia/privkey.pem",
  //     "utf8"
  //   ),
  //   cert: readFileSync(
  //     "/etc/letsencrypt/live/api.credential.asia/cert.pem",
  //     "utf8"
  //   ),
  //   ca: readFileSync(
  //     "/etc/letsencrypt/live/api.credential.asia/chain.pem",
  //     "utf8"
  //   ),
  // };
  // server = createServer(httpsOptions, app);
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
server.on("error", (error) => {
  console.log("Error: ", error);
});
