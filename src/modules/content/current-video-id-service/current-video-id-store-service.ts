import {CurrentVideoId} from "../../shared/chrome-storage/property/current-video-id";

/**
 *  Store the current video id in the chrome storage
 */
export class CurrentVideoIdStoreService {
    private currentVideoIdProperty: CurrentVideoId;
    constructor(
        currentVideoIdAccess: CurrentVideoId,
    ) {
        this.currentVideoIdProperty = currentVideoIdAccess;
        this.getVideoIdOnPage()
        this.listenToUserInteractions();
    }

    private getVideoIdOnPage() {
        const url = window.location.href;
        const regex = /videos\/(\d+v\w*)/;
        const match = url.match(regex);
        const currentVideoId = match?.[1] ?? null;
        this.currentVideoIdProperty.set(currentVideoId).catch((error) => console.error(error));
    }

    private listenToUserInteractions() {
        const debouncedGetVideoIdOnPage = this.debounce(() => {
            if (this.currentVideoIdProperty.get() === null) {
                this.getVideoIdOnPage();
            }
        }, 1000);

        document.body.addEventListener('mousemove', debouncedGetVideoIdOnPage);

        document.body.addEventListener('click', () => {
            if (this.currentVideoIdProperty.get() === null) {
                this.getVideoIdOnPage();
            }
        });

        document.body.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (this.currentVideoIdProperty.get() === null) {
                    this.getVideoIdOnPage();
                }
            }
        });
    }

    private debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }
}