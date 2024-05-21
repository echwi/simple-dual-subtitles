import {CurrentVideoId} from "../../shared/chrome-storage/property/current-video-id";
import WebNavigationTransitionCallbackDetails = chrome.webNavigation.WebNavigationTransitionCallbackDetails;

export class CurrentVideoIdStoreService {
    private currentVideoIdProperty: CurrentVideoId;

    constructor(
        currentVideoIdAccess: CurrentVideoId,
    ) {
        this.currentVideoIdProperty = currentVideoIdAccess;
        this.listenToAndSaveVideoIdChanges()
    }

    private listenToAndSaveVideoIdChanges() {
        const onHistoryOrTabChange = this.onHistoryChange.bind(this);
        chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryOrTabChange);
        const onTabActivated = this.onTabActivated.bind(this);
        chrome.tabs.onActivated.addListener(onTabActivated);
    }

    private onHistoryChange(details: WebNavigationTransitionCallbackDetails) {
        this.saveToCurrentVideoId(details.url);
    }

    private onTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            this.saveToCurrentVideoId(tab.url)
        });
    }

    private saveToCurrentVideoId(url: string | undefined) {
        if (!url || !url.includes('viki.com')) {
            return;
        }
        const regex = /videos\/(\d+v\w*)/;
        const match = url.match(regex);
        const videoIdOnPage = match ? match[1] : null;
        this.currentVideoIdProperty.set(videoIdOnPage).catch(
            (error) => console.error(error))
    }
}