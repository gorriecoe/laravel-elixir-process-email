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
    merge = require('merge-deep'),
    sass = require('gulp-sass'),
    Task = Elixir.Task;

var config = {
    source: {
        sass: 'resources/assets/sass/emails/email.scss',
        templates: 'resources/templates/emails',
        images: 'resources/images/emails',
        allowed_view_extensions: 'blade.php'
    },
    public: {
        views: 'public/views',
        css: 'public/css',
        images: 'public/images/emails'
    }
};

Elixir.extend('processEmails', function(options) {
    config = merge(config, options);
    var templates = config.source.templates + '/**/*.' + config.source.allowed_view_extensions;
    // console.log(templates);
    new Task('processEmails', function() {
        // this.recordStep('Inlining Css');
        gulp.src(config.source.sass)
            .pipe(sass())
            .pipe(gulp.dest(config.public.css));
        return gulp
            .src(templates)
            .pipe(inky())
            .pipe(prettify({ indent_size: 2 }))
            .pipe(injectString.replace('-&gt;', '->'))
            .pipe(injectString.replace('=&gt;', '=>'))
            .pipe(injectString.replace('&quot;', '"'))
            .pipe(injectString.replace('&apos;', '\''))
            .pipe(instyler(config.public.css + '/email.css'))
            .pipe(gulp.dest(config.public.views));
    })
    .watch(templates);

    function instyler(css) {
        var css = fs.readFileSync(css).toString();
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
