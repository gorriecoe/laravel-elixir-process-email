var gulp = require('gulp'),
    Elixir = require('laravel-elixir'),
    htmlmin = require('gulp-htmlmin'),
    gulpif = require('gulp-if'),
    injectString = require('gulp-inject-string'),
    cssInline = require('gulp-inline-css'),
    prettify = require('gulp-prettify'),
    inky = require('inky'),
    lazypipe = require('lazypipe'),
    sass = require('node-sass'),
    siphon = require('siphon-media-query');


Elixir.config.email = {
    assets: {
        // Defines the path to the sass file.  This is a direct path and should not include wildcards.
        sass: Elixir.config.assetsPath + '/emails/sass/email.scss',

        // Defines the path to the email source files.
        templates: Elixir.config.assetsPath + '/emails/views/**/*.blade.php'
    },
    public: {
        // Defines the path to the folder containing the compiled email templates.
        views: Elixir.config.publicPath + '/views'
    }
};

Elixir.extend('processEmails', function() {
    var config = Elixir.config.email;
    new Elixir.Task('processEmails', function() {
        this.recordStep('Processing Emails');
        return gulp
            .src(config.assets.templates)
            .pipe(inky())
            .pipe(prettify({ indent_size: 2 }))
            .pipe(injectString.replace('-&gt;', '->'))
            .pipe(injectString.replace('=&gt;', '=>'))
            .pipe(injectString.replace('&quot;', '"'))
            .pipe(injectString.replace('&apos;', '\''))
            .pipe(instyler())
            .pipe(minifier())
            .pipe(gulp.dest(config.public.views));
    })
    .watch(config.assets.templates);

    function instyler() {
        var sassResult = sass.renderSync({file: config.assets.sass}),
            css = sassResult.css.toString(),
            breakpointCss = siphon(css);

        var pipe = lazypipe()
            .pipe(
                cssInline,
                {
                    applyStyleTags: false,
                    removeStyleTags: true,
                    preserveMediaQueries: true,
                    removeLinkTags: false,
                    extraCss: css
                }
            )
            .pipe(
                injectString.replace,
                '<!-- <style> -->', '<style>' + breakpointCss + '</style>'
            );
        return pipe();
    }

    var minifier = lazypipe()
        .pipe(function () {
            return gulpif(Elixir.config.production, htmlmin({
                collapseWhitespace: true,
                minifyCSS: true
            }));
        });
});
