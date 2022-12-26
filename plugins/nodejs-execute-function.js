const _ = require("lodash");
const vm = require("vm");

function SandboxExecutionError(err) {
  Error.call(this);
  this.message = "--> " + err.name + " - " + err.message;
}

SandboxExecutionError.prototype = _.create(Error.prototype, {
  constructor: SandboxExecutionError,
  name: "SandboxExecutionError",
});

const execute = function (params) {
  var args = _.toArray(arguments);
  var params = _.omit(args.shift(), ["name"]);
  var callback = args.pop();

  // Callback wrapper
  var myCallback = function () {
    console.log("Código externo executado.");
    return callback.apply(this, arguments);
  };

  var argumentsToExecution = [params];
  argumentsToExecution = argumentsToExecution.concat(args);
  argumentsToExecution.push(myCallback);

  var script = vm.createScript(params.code);
  var sandbox = {
    console: console,
    setTimeout: setTimeout,
    Buffer: Buffer,
    arguments: argumentsToExecution,
    params: params,
    args: args,
    callback: myCallback,
    module: module,
  };

  if (_.isEmpty(sandbox.params)) sandbox.params = null;

  // create a context for the script to run in including useful globals
  var requireds = {
    fetch: require("node-fetch"),
  };
  console.log('requireds: ', requireds);
  // create a new require function that only allows
  // access to the required modules
  sandbox.require = function (moduleName) {
    return requireds[moduleName];
  };
  sandbox.__dirname = __dirname;

  try {
    script.runInNewContext(sandbox);
  } catch (err) {
    console.log('err: ', err);
    myCallback(new SandboxExecutionError(err));
  }
};

module.exports.name = "nodejs-execute-function";
module.exports.action = execute;
