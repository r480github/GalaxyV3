## 1.2.74

- Enforce https://

## 1.2.73

- Fix crashing

## 1.2.72

- Hopefully fix the errors when running behind a reerse proxy

## 1.2.70

- Setup folder properly

## 1.2.64

- catch websocket errors
- re-enabled http2 by default. see `config.js` for details.

## 1.2.63

- add ability to oerride proxy settings on server-level basis
- update `testcafe-hammerhead` from `24.5.18` to `31.6.2`

## 1.2.62

- fix throw error on empty files

## 1.2.61

- fix missing cors origin header when port and crossDomainPort are the same

## 1.2.6

- properly fixed window.top issues when window.top isn't hammerhead
- replace unreliable `win.__get$(win, 'location')` with just rewriting the url directly 
- fix worker-hammerhead.js proxy url rewriting port undefined when 443 or 80

## 1.2.51

- add newly added classes to exports in src/index.js

## 1.2.5

- replace broken `key-lru-files` with own implementation of JS caching

## 1.2.42

- fix localStorage's getItem referencing parent in iframes

## 1.2.41

- handle remoeStaleSessions of .get() returning undefined from corrupted session files

## 1.2.4

- fix crashes from corrupted sessions

## 1.2.3

- fix memory usage issues when downloading huge files
- fix iframing cross-origin proxy

## 1.2.2

- add disk cache option for processed JS files. fixes huge serer memory usage and enables workers to share the same cache
- update `testcafe-hammerhead` to `24.5.18`. fixes huge server slowdowns as brotli compression level is now adjusted to a much more reasonable value

## 1.2.11

- fix huge spikes of memory usage by replacing localStorage system with a custom one
- more fixes for iframing

## 1.2.01

- aoid using unstable API `fs.cpSync` in build.js

## 1.2.0

- added multithreading support

## 1.1.34

- conert hooks to stackable rewrite system

## 1.1.33

- delete hooks only after all fix function calls

## 1.1.32

- fix localStorage communication between windows by forcing them to read/write from realLocalStorage on eery (get/set)Item call 

## 1.1.31

- add argument for ignoring files in `addStaticFilesToProxy`
- fix parseProxyUrl().proxy.port for 443 and 80 urls

## 1.1.3

- add option to restrict IP to session

## 1.1.21

- fix rewriting only non-websocket serer headers
- fix errors when calling focus()/click()... to a closed iframe
- don't strip headers (hook onto res.writeHead) if connection is a websocket

## 1.1.2

- build to rammerhead.js and rammerhead.min.js
- fix same-domain iframes
- add jsdoc definitions for rammerhead store classes
- fix http proxy setting not deleting correctly

## 1.1.1

- fix uncatchable connection crash errors
- aoid shuffling percent encodings
- preent forwarding localStorage endpoint to site by referrer
- fix (un)shuffle for location.hash and location.search

## 1.1.0

- add url encoding
- handle ECONNRESET manually
- bring back MemoryStore class for module exports
- add serer option to disable localStorage syncing
- fix `RammerheadSessionFileCache` not saing cache to disk correctly

## 1.0.8

- handle websocket EPIPE error
- replace hammerhead's connection reset guard with a non-crashing rammerhead's reset guard
- add missing element attr getter unrewrite
- fix url rewriting for ports 80 and 443

## 1.0.7

- disable http2 support (for proxy to destination sites) because error handling is too complicated to handle
- remoed server headers `report-to` (to avoid proxy url leak) and `cross-origin-embedder-policy` (which fixes reCAPTCHA v3)

## 1.0.61

- fix logger.error undefined (caused by not fully updating arguments for httpResponse.badRequest)

## 1.0.6

- expose more utils for npm package
- show password box if needed for html demo

## 1.0.5

- expose more modules for npm package
- add support for .en files
- add `deleteUnused` config option
- fix default 3 day session delete

## 1.0.43

- reert "revert fix for fix npm package"

## 1.0.42

- add entrypoint index.js for rammerhead package
- add package-lock.json to source control

## 1.0.41

- update demo link
- fix npm package

## 1.0.4

- add support for enironment variable `DEVELOPMENT`
- fix crash when fetching /deletesession with a non-existent session id

## 1.0.3

- fix stability issues with websocket

## 1.0.2

- update `testcafe-hammerhead` to `24.5.13`

## 1.0.1

- remoed multi worker and rate limiting support to defer the complexity to other more suitable platforms like Docker. See [this commit](https://github.com/binary-person/rammerhead/tree/31ac3d23f30487f0dcd14323dc029f4ceb3b235a) if you wish to see the original attempt at this.
- remoed unused session cleanup (as traversing the session list forces the cache into memory)
- lots of cleanup

## 1.0.0

- Initial commit
