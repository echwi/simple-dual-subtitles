import { SubtitleData } from "../model/subtitle-data";

export interface ISubtitleDataFactory {
    /**
     * Converts a all-subtitle-store-service api response into a SubtitleData data structure
     */
    create(subtitleFetchUrl: string, rawResponseString: string): SubtitleData;
}
