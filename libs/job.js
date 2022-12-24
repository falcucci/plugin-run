var _ = require("lodash");
var async = require("async");
var startExecution = new Date();

const PARALLEL = 'parallel';

function execute(steps, callback) {
  console.time(">>> execution time");
  console.log(">>> initialize execution for each step");

  async.reduce(
    steps,
    null,
    function (memo, step, callback) {
      console.log(">>> execute step: " + step.name);
      const hasContainer = _.has(step, "container");
      const hasCommand = _.has(step, "command");
      const hasScript = _.has(step, "script");

      if (hasContainer) {
        console.log(">>> execute step in container: " + step.container);
        if (step.container === PARALLEL) {
          console.log(">>> execute step in parallel");
          // execute the step withou specify the limit
          // of parallelism
          async.map(
            step.steps,
            function (step, callback) {
              const plugin = plugins[step.name];
              const params = [step].concat(memo);
              params.push(function () {
                return callback.apply(this, arguments);
              });

              plugin.action.apply(this, params);
            },
            function (err, results) {
              console.log(">>> parallel execution finished");
              return callback(err, results);
            }
          );
        }
      } else {
        var plugin = plugins[step.name];

        var params = [step].concat(memo);
        params.push(function () {
          var arguments = _.toArray(arguments);
          var args = [arguments.shift()];
          args.push(arguments);

          return callback.apply(this, args);
        });

        plugin.action.apply(this, params);
      }
    },
    function (err, result) {
      console.timeEnd(">>> execution time");
      console.log(">>> execution finished");
      console.log("Notifying job's error..");
      var finalExecution = new Date() - startExecution;
      console.log(">>> execution time: " + finalExecution + "ms");
      return callback(err, result);
    }
  );

  return;
}

module.exports.execute = execute;
