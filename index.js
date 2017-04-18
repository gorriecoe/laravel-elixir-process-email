var gulp = require('gulp'),
    Elixir = require('laravel-elixir'),
    fs = require('fs'),
    inky = require('inky'),
    prettify = require('gulp-prettify'),
    siphon = require('siphon-media-query'),
    lazypipe = require('lazypipe'),
    cssInline = require('gulp-inline-css'),
    htmlmin = require('gulp-htmlmin'),
    injectString = require('gulp-inject-string'),
    sass = require('node-sass'),
    Task = Elixir.Task;

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

var emailcss;

Elixir.extend('processEmails', function(options) {
    var config = Elixir.config.email;
    new Task('processEmails', function() {
        return gulp
            .src(config.source.templates)
            .pipe(inky())
            .pipe(prettify({ indent_size: 2 }))
            .pipe(injectString.replace('-&gt;', '->'))
            .pipe(injectString.replace('=&gt;', '=>'))
            .pipe(injectString.replace('&quot;', '"'))
            .pipe(injectString.replace('&apos;', '\''))
            .pipe(instyler())
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
            )
            .pipe(
                htmlmin,
                {
                    collapseWhitespace: true,
                    minifyCSS: true
                }
            );

        return pipe();
    }
});
