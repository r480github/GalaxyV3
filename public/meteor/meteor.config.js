
var config = {
  prefix: "/service/",
  codec: self.$meteor_codecs.xor,
  debug: true,
  plugins: [],
  files: {
    client: "/meteor/meteor.client.js",
    worker: "/meteor/meteor.worker.js",
    bundle: "/meteor/meteor.bundle.js",
    codecs: "/meteor/meteor.codecs.js",
    config: "/meteor/meteor.config.js"
  }
};
self.$meteor_config = config;