const fs = require("fs");
const path = require("path");
const _ = require("lodash");

//  Load all plugins
const files = fs.readdirSync(__dirname);

// Remove this file from the list
files = _.pull(files, "index.js");

const plugins = {};

// Require each plugin
_.each(files, function (pluginFile) {
  if (/\.js$/.test(pluginFile)) {
    const plugin = require(path.resolve(__dirname, pluginFile));
    console.log("Loaded plugin: " + plugin.name);
    // Add the plugin to the list
    plugins[plugin.name] = plugin;
  }
});

module.exports = plugins;
