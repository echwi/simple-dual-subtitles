import {CurrentVideoId} from "../shared/chrome-storage/property/current-video-id";
import {CurrentVideoIdStoreService} from "./current-video-id-store-service/current-video-id-store-service";
import {AbstractEntrypoint} from "../shared/entrypoint/abstract-entrypoint";

{
    class BackgroundEntrypoint extends AbstractEntrypoint {
        constructor() {
            super();
            this.init().catch(console.error);
        }

        async init() {
            const currentVideoIdProperty = await this.initProperty(CurrentVideoId);

            new CurrentVideoIdStoreService(currentVideoIdProperty)
        }
    }
}

new BackgroundEntrypoint();