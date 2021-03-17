if (process.env.NODE_ENV === "Staging") {
  require("dotenv").config({ path: ".env.staging" });
} else if (process.env.NODE_ENV === "Production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env" });
}

console.log(`=== ${process.env.NODE_ENV ? process.env.NODE_ENV : "DEV"} ===`);

require("@babel/polyfill");
require("@babel/register");
require("./server");
