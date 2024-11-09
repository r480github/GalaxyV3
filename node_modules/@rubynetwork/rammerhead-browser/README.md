# Rammerhead Browser

- Easily use Rammerhead from the browser!

## Usage

- If your using something like Vite:
```js
import { RammerheadEncode } from '@rubynetwork/rammerhead-browser';

//use the function

RammerheadEncode('https://google.com', '/rammer/' /*This option can be ommited if this isn't behind a reverse proxy */);
```

- No bundler:
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="https://unpkg.com/@rubynetwork/rammerhead-browser" defer />
    </head>
    <body>
        <script>
            RammerheadEncode('https://google.com', '/rammer/' /* Omit if not running behind a reverse proxy */);
        </script>
    </body>
</html>
