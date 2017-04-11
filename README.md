# laravel-elixir-process-email
This package adds email processing and templating.  It uses foundation inky and inline css.

## Install
```
npm install laravel-elixir-process-email --save-dev
```

Add plugin to your gulpfile.js

```javascript
const elixir = require('laravel-elixir');
    require('laravel-elixir-process-email');

elixir(mix => {
    mix.processEmails({
        source: {
            sass: 'emails/scss/email.scss',
            templates: 'emails/templates',
            images: 'emails/img',
            allowed_view_extensions: 'blade.php'
        },
        public: {
            views: 'public/templates/emails',
            css: 'public/css',
            images: 'public/images/emails'
        }
    });
});
```

## Inky
http://foundation.zurb.com/emails/docs/inky.html
