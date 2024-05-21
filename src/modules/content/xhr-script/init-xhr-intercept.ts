import {appConfig} from "../../../app-config";
import {ReplaySubject} from "rxjs";
import {InterceptedSubtitleData} from "../../shared/xhr-intercept/xhr-intercept";

export function getSubtitleRequestResponses(): ReplaySubject<InterceptedSubtitleData> {
    const subtitleRequestResponses$ = new ReplaySubject<InterceptedSubtitleData>();

    function executeScriptToInterceptSubtitleXhrRequests() {
        const xhrInterceptScriptEl = document.createElement('script');
        xhrInterceptScriptEl.src = chrome.runtime.getURL('xhr_intercept.bundle.js');
        xhrInterceptScriptEl.onload = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
        (document.head || document.documentElement).appendChild(xhrInterceptScriptEl);
        document.addEventListener(
            appConfig.events.customXhrIntercept,
            function (event: CustomEvent) {
                subtitleRequestResponses$.next(event.detail);
            }
        );
    }

    executeScriptToInterceptSubtitleXhrRequests();
    return subtitleRequestResponses$;
}