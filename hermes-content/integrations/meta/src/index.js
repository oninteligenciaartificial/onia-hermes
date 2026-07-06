'use strict';
// Barrel for the ONIA Meta Ads engine. Self-contained, dependency-free
// (Node builtins + global fetch). DRY by default; zero spend without Sergio.
module.exports = {
  ...require('./config'),
  ...require('./schema'),
  ...require('./build'),
  ...require('./approval'),
  ...require('./creative-map'),
  ...require('./pixel'),
  ...require('./client'),
};
