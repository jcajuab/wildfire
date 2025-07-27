// ! This is a temporary workaround for automatically sorting Tailwind CSS classes,
// ! since Biome support is still limited.
// ! See: https://biomejs.dev/linter/rules/use-sorted-classes/

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  semi: false,
  jsxSingleQuote: true,
  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
