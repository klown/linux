/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("gsettingsBridge", require);
fluid.require("orca", require);
fluid.require("alsa", require);
fluid.require("xrandr", require);

kettle.config.makeConfigLoader({
    nodeEnv: kettle.config.getNodeEnv("fm.ps.sr.dr.mm.os.lms.development"),
    configPath: kettle.config.getConfigPath() || "../node_modules/universal/gpii/configs"
});

/* Device Reporter
 *
 * This is not the place where we want to trigger this and should be moved
 * to elsewhere.
 *
**/

var http = require('http');
var os = require('os');

var solutionsRegistry = "";
var installedSolutions = [];

require("packagekit");
packageKit = fluid.registerNamespace("gpii.packageKit");
var pkgs = packageKit.get("installed;~devel");

http.get("http://localhost:8081/solution/" + os.platform(), function (res) {

  res.on('data', function (data) {
    solutionsRegistry += data;
  });

  res.on('end', function() {
    var installedSolution = null;
    var solutions = JSON.parse(solutionsRegistry);
    for (var solution in solutions) {
      if ('gpii.packageKit' in solutions[solution].contexts) {
        solutionSpec = solutions[solution].contexts['gpii.packageKit'];
        for (var app in pkgs['data']) {
          if (pkgs['data'][app].name == solutionSpec.name) {
            installedSolution = {"id": solutions[solution].id};
            installedSolutions.push(installedSolution);
          }
        }
      }
    }

    console.log(installedSolutions);

  });
});
