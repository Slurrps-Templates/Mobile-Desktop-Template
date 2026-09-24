const path = require('path');

module.exports = {
  packagerConfig: {
    // Bundles the Ionic web build next to the packaged app as resources/www
    extraResource: [path.resolve(__dirname, '../Mobile/www')],
  },
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux'],
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
  ],
};
