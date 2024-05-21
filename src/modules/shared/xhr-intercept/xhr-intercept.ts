import {appConfig} from "../../../app-config";

export interface InterceptedSubtitleData {
    text: string,
    url: string,
}

/**
 * Hack to read viki responses,
 * so that no additional requests need to be sent to get all required Viki data
 */
export const interceptXhrAndEmitSubtitleResponses = function() {
    function isSubtitleRequest(url) {
        return url.includes(appConfig.misc.subtitleRequestUrlSubstring);
    }

    const XHR = XMLHttpRequest.prototype;
    const send = XHR.send;
    const open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
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