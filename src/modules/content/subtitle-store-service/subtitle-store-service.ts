import {AllSubtitles} from "../../shared/chrome-storage/property/all-subtitles";
import {SubtitleDataFactory} from "../../shared/factory/subtitle-data-factory";
import {ReplaySubject} from "rxjs";
import {InterceptedSubtitleData} from "../../shared/xhr-intercept/xhr-intercept";

/**
 * Save the subtitle data in the chrome storage
 */
export class SubtitleStoreService {
    private alreadyProcessedUrls: string[] = [];
    private allSubtitlesProperty: AllSubtitles;
    private subtitleDataFactory: SubtitleDataFactory;
    private subtitleRequestResponses$: ReplaySubject<InterceptedSubtitleData>

    constructor(
        allSubtitles: AllSubtitles,
        subtitleDataFactory: SubtitleDataFactory,
        subtitleRequestResponses$: ReplaySubject<InterceptedSubtitleData>
    ) {
        this.allSubtitlesProperty = allSubtitles;
        this.subtitleDataFactory = subtitleDataFactory;
        this.subtitleRequestResponses$ = subtitleRequestResponses$;

        this.getAlreadyProcessedUrls().catch(console.error);
        this.initiateProcessingOfInterceptedSubtitleData();
    }

    async getAlreadyProcessedUrls() {
        if (!this.allSubtitlesProperty.get()) {
            this.alreadyProcessedUrls = [];
            return;
        }
        this.alreadyProcessedUrls = this.allSubtitlesProperty.get().map(subtitleData => subtitleData.url)
    }

    private initiateProcessingOfInterceptedSubtitleData(): void {
        this.subtitleRequestResponses$.subscribe((interceptedData: InterceptedSubtitleData) => {
            if (this.urlIsAlreadyProcessed(interceptedData.url)) {
                return;
            }
            this.alreadyProcessedUrls.push(interceptedData.url);
            const subtitleData = this.subtitleDataFactory.create(interceptedData.url, interceptedData.text);
            this.allSubtitlesProperty.pushDistinct(subtitleData);
        });
    }

    private urlIsAlreadyProcessed(url: string): boolean {
        return this.alreadyProcessedUrls.includes(url);
    }
}