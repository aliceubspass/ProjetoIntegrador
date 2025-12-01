// Usar a nova package `@tailwindcss/postcss` conforme o erro do build.
// Isso garante compatibilidade com a forma como o Tailwind é executado via PostCSS.
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
