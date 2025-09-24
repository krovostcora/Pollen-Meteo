module.exports = {
    env: {
        browser: true,
        es2021: true,
        "cypress/globals": true
    },
    extends: [
        "eslint:recommended",
        "plugin:cypress/recommended"
    ],
    plugins: ["cypress"],
    rules: {
    }
};
