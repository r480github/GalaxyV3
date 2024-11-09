import RequestPipelineContext from 'testcafe-hammerhead/lib/request-pipeline/context/index.js';
import StrShuffler from './StrShuffler.js';
import getSessionId from './getSessionId.js';

const replaceUrl = (url, replacer) => {
    //        regex:              https://google.com/    sessionid/   url
    return (url || '').replace(
        /^((?:[a-z0-9]+:\/\/[^/]+)?(?:\/[^/]+\/))([^]+)/i,
        function (_, g1, g2) {
            return g1 + replacer(g2);
        }
    );
};

// unshuffle incoming url //
import BUILTIN_HEADERS from 'testcafe-hammerhead/lib/request-pipeline/builtin-header-names.js';
const _dispatch = RequestPipelineContext.prototype.dispatch;
RequestPipelineContext.prototype.dispatch = function (openSessions) {
    let sessionId = getSessionId(this.req.url);
    let session = sessionId && openSessions.get(sessionId);
    if (!session) {
        sessionId = getSessionId(this.req.headers[BUILTIN_HEADERS.referer]);
        session = sessionId && openSessions.get(sessionId);
    }
    if (session && session.shuffleDict) {
        const shuffler = new StrShuffler(session.shuffleDict);
        this.req.url = replaceUrl(this.req.url, (url) => shuffler.unshuffle(url));
        if (getSessionId(this.req.headers[BUILTIN_HEADERS.referer]) === sessionId) {
            this.req.headers[BUILTIN_HEADERS.referer] = replaceUrl(
                this.req.headers[BUILTIN_HEADERS.referer],
                (url) => shuffler.unshuffle(url)
            );
        }
    }

    return _dispatch.call(this, openSessions);
};

// shuffle rewritten proxy urls //
let disableShuffling = false; // for later use
const _toProxyUrl = RequestPipelineContext.prototype.toProxyUrl;
RequestPipelineContext.prototype.toProxyUrl = function (...args) {
    const proxyUrl = _toProxyUrl.apply(this, args);

    if (!this.session.shuffleDict || disableShuffling) return proxyUrl;

    const shuffler = new StrShuffler(this.session.shuffleDict);
    return replaceUrl(proxyUrl, (url) => shuffler.shuffle(url));
};

// unshuffle task.js referer header
import Proxy from 'testcafe-hammerhead/lib/proxy/index.js';
const __onTaskScriptRequest = Proxy.prototype._onTaskScriptRequest;
Proxy.prototype._onTaskScriptRequest = async function _onTaskScriptRequest(req, ...args) {
    const referer = req.headers[BUILTIN_HEADERS.referer];

    const sessionId = getSessionId(referer);
    const session = sessionId && this.openSessions.get(sessionId);
    if (session && session.shuffleDict) {
        const shuffler = new StrShuffler(session.shuffleDict);
        req.headers[BUILTIN_HEADERS.referer] = replaceUrl(
            req.headers[BUILTIN_HEADERS.referer],
            (url) => shuffler.unshuffle(url)
        );
    }
    return __onTaskScriptRequest.call(this, req, ...args);
};

// don't shuffle action urls (because we don't get to control the rewriting when the user submits the form)
import DomProcessor from 'testcafe-hammerhead/lib/processing/dom/index.js';
const __processUrlAttrs = DomProcessor.prototype._processUrlAttrs;
DomProcessor.prototype._processUrlAttrs = function _processUrlAttrs(el, urlReplacer, pattern) {
    try {
        disableShuffling = pattern.urlAttr?.toLowerCase() === 'action';
        __processUrlAttrs.call(this, el, urlReplacer, pattern);
        disableShuffling = false;
    } catch (e) {
        disableShuffling = false;
        throw e;
    }
};
