module.exports = {
  extends: ["react-app", "react-app/jest"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: "module",
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
};
