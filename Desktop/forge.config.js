module.exports = {
  packagerConfig: {
    icon: 'assets/icon/favicon', // Update path if you have a desktop icon
  },
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
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
