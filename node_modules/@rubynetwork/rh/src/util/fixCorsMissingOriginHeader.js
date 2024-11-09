import BUILTIN_HEADERS from 'testcafe-hammerhead/lib/request-pipeline/builtin-header-names.js';
import transforms from 'testcafe-hammerhead/lib/request-pipeline/header-transforms/transforms.js';

/**
 * if we create this server with port === crossDomainPort, origin header doesn't get properly sent
 * so we manually add it if reqOrigin !== url
 */

transforms.forcedRequestTransforms[BUILTIN_HEADERS.origin] = (_src, ctx) => {
    if (ctx.serverInfo.port != ctx.serverInfo.crossDomainPort) return void 0;
    return ctx.dest.reqOrigin || ctx.dest.domain;
};
