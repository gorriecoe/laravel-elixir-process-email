# laravel-elixir-process-email
This package adds email processing and templating.  It uses foundation inky and inline css.

## Install
```
npm install laravel-elixir-process-email --save-dev
```

Add plugin to your gulpfile.js

```javascript
const Elixir = require('laravel-elixir');
    require('laravel-elixir-process-email');

/*-------------------------------------------------------------------
Configuration
-------------------------------------------------------------------*/

// Define the path to the sass file.  This is a direct path and should not include wildcards.
// Its recommended to prefix this with the assetsPath.
Elixir.config.email.assets.sass: Elixir.config.assetsPath + '/emails/scss/email.scss';

// Define the path to the email source files.
// Its recommended to prefix this with the assetsPath.
Elixir.config.email.assets.templates: Elixir.config.assetsPath + '/emails/templates/**/*.blade.php';

// Define the path to the folder containing the compiled email templates.
// Its recommended to prefix this with the publicPath.
Elixir.config.email.public.views: Elixir.config.publicPath + '/templates/emails';

/*-------------------------------------------------------------------
Tasks
-------------------------------------------------------------------*/

Elixir(mix => {
    mix.processEmails();
});
```

## Inky
Process Email uses Inky to help template.  Learn more about it at:
http://foundation.zurb.com/emails/docs/inky.html
