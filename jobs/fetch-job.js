const fs = require("fs");
const jobs = require("../libs/job");

// import the code to execute step by step
const code = fs
  .readFileSync("./scripts/fetch.js", "utf8")
  .toString();

// add each step to the queue
// to be executed in order
// the callback() function is called and
// the next step is executed when the previous step
// is done getting the data from the previous step result
steps = [
  { name: "nodejs-execute-function", code },
  {
    name: "nodejs-execute-function",
    code:
      'console.log("previous result: " + JSON.stringify(args[0]))',
  },
];

jobs.execute(steps, err => {
  console.log("Job completed");
  if (err) {
    console.log("Job failed");
    console.log(err);
    process.exit(1);
  }
});
