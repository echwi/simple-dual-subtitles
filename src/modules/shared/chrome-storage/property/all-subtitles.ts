import {AbstractStorageProperty} from './abstract/abstract-storage-property';
import {SubtitleData} from "../../model/subtitle-data";

export class AllSubtitles extends AbstractStorageProperty<SubtitleData[]> {
    private constructor() {
        super();
    }

    async init(): Promise<void> {
        return super.init('allSubtitles');
    }

    pushDistinct(subtitle: SubtitleData): void {
        let allSubtitles: SubtitleData[] | null = this.get();
        if (!allSubtitles) {
            allSubtitles = [];
        }
        if (!allSubtitles.some(
            existingSubtitle => existingSubtitle.url === subtitle.url)
        ) {
            allSubtitles.push(subtitle);
            this.set(allSubtitles).catch(console.error);
        }
    }
}

