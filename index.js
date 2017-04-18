var gulp = require('gulp'),
    Elixir = require('laravel-elixir'),
    htmlmin = require('gulp-htmlmin'),
    gulpif = require('gulp-if'),
    injectString = require('gulp-inject-string'),
    cssInline = require('gulp-inline-css'),
    prettify = require('gulp-prettify'),
    inky = require('inky'),
    lazypipe = require('lazypipe'),
    sass = require('node-sass')
    siphon = require('siphon-media-query');


Elixir.config.email = {
    source: {
        sass: Elixir.config.assetsPath + '/emails/sass/email.+(scss|sass)',
        templates: Elixir.config.viewPath + '/emails/views/**/*.blade.php',
        images: Elixir.config.assetsPath + '/emails/images/'
    },
    public: {
        views: Elixir.config.publicPath + '/views',
        images: Elixir.config.publicPath + '/images/emails'
    }
};

Elixir.extend('processEmails', function(options) {
    var config = Elixir.config.email;
    new Elixir.Task('processEmails', function() {
        this.recordStep('Processing Emails');
        return gulp
            .src(config.source.templates)
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
    .watch(config.source.templates);

    function instyler() {
        var sassResult = sass.renderSync({
            file: config.source.sass
        });
        var css = sassResult.css.toString();
        var breakpointCss = siphon(css);
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
