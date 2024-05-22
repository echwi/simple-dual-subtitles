import {appConfig} from "../../../app-config";

export interface InterceptedSubtitleData {
    text: string,
    url: string,
}

/**
 * Monkeypatch to intercept Viki subtitle responses,
 * eliminating the need for additional requests to obtain all necessary Viki data
 */
export const interceptXhrAndEmitSubtitleResponses = function() {
    function isSubtitleRequest(url) {
        return url.includes(appConfig.misc.subtitleRequestUrlSubstring);
    }

    const XHR = XMLHttpRequest.prototype;
    const send = XHR.send;
    const open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url;
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            if (!isSubtitleRequest(this.url)) {
                return;
            }
            const eventData: InterceptedSubtitleData = {
                text: this.response,
                url: this.url
            }
            const eventAtXhrIntercept = new CustomEvent(
                appConfig.events.customXhrIntercept,
                {
                    detail: eventData
                }
            );
            document.dispatchEvent(eventAtXhrIntercept);
        });
        return send.apply(this, arguments);
    };
};
interceptXhrAndEmitSubtitleResponses();