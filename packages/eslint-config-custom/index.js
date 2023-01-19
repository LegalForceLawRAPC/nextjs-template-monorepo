module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "airbnb",
    "airbnb-typescript",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint", "import"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["apps/*/tsconfig.json"],
      },
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/semi": "off",

    // react
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",

    // next
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/prefer-default-export": "off",
    "import/no-unresolved": [2, { caseSensitive: false }],

    "no-plusplus": "off",
    "no-nested-ternary": "off",
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
    "jsx-a11y/label-has-for": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
  },
};
