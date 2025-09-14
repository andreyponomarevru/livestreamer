module.exports = {
  plugins: [
    require("autoprefixer"),

    require("cssnano")({
      preset: [
        "default",
        {
          normalizeWhitespace: true // uglify bundled css code
        }
      ]
    })
  ]
};
