console.log("Initialize the app and start the server");

const fs = require("fs");

// import the code to execute step by step
const code = fs.readFileSync("./code.js", "utf8").toString();

steps = [
  {
    name: "step1",
    code: code,
  },
];

