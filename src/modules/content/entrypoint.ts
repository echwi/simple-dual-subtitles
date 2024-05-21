import {AllSubtitles} from "../shared/chrome-storage/property/all-subtitles";
import {CurrentVideoId} from "../shared/chrome-storage/property/current-video-id";
import {CurrentVideoIdStoreService} from "./current-video-id-service/current-video-id-store-service";
import {CurrentSubtitleService} from "./current-subtitle-service/current-subtitle-service";
import {TargetLanguageCode} from "../shared/chrome-storage/property/target-language-code";
import {AbstractEntrypoint} from "../shared/entrypoint/abstract-entrypoint";
import {getSubtitleRequestResponses} from "./xhr-script/init-xhr-intercept";
import {SubtitleStoreService} from "./subtitle-store-service/subtitle-store-service";
import {SubtitleDataFactory} from "../shared/factory/subtitle-data-factory";
import {DomService} from "./dom/dom-service";

/** Do this as early as possible */
const subtitleRequestResponses$ = getSubtitleRequestResponses();
{
    class ContentEntrypoint extends AbstractEntrypoint {
        constructor() {
            super();
            this.init().catch(console.error);
        }

        async init() {
            const allSubtitlesProperty = await this.initProperty(AllSubtitles);
            const currentVideoIdProperty = await this.initProperty(CurrentVideoId);
            const targetLanguageCodeProperty = await this.initProperty(TargetLanguageCode);
            const subtitleDataFactory: SubtitleDataFactory = new SubtitleDataFactory();
            const currentSubtitleService: CurrentSubtitleService = new CurrentSubtitleService(allSubtitlesProperty, currentVideoIdProperty, targetLanguageCodeProperty);
            new CurrentVideoIdStoreService(currentVideoIdProperty);
            new SubtitleStoreService(allSubtitlesProperty, subtitleDataFactory, subtitleRequestResponses$);
            new DomService(currentSubtitleService);
        }
    }
}

new ContentEntrypoint();