import {AllSubtitles} from "../shared/chrome-storage/property/all-subtitles";
import {CurrentVideoId} from "../shared/chrome-storage/property/current-video-id";
import {TargetLanguageCode} from "../shared/chrome-storage/property/target-language-code";
import {DomService} from "./view/dom-service";
import {AbstractEntrypoint} from "../shared/entrypoint/abstract-entrypoint";

{
    class PopupEntrypoint extends AbstractEntrypoint {
        constructor() {
            super();
            this.init().catch(console.error);
        }

        async init() {
            const allSubtitlesProperty = await this.initProperty(AllSubtitles);
            const currentVideoIdProperty = await this.initProperty(CurrentVideoId);
            const targetLanguageCodeProperty = await this.initProperty(TargetLanguageCode);

            new DomService(
                allSubtitlesProperty,
                currentVideoIdProperty,
                targetLanguageCodeProperty,
            );
        }
    }
}

new PopupEntrypoint();