import {AllSubtitles} from "../../shared/chrome-storage/property/all-subtitles";
import {CurrentVideoId} from "../../shared/chrome-storage/property/current-video-id";
import {SubtitleData, SubtitleTimestampWithContent} from "../../shared/model/subtitle-data";
import {TargetLanguageCode} from "../../shared/chrome-storage/property/target-language-code";

/**
 * Provides the current subtitle string based on
 * the video id, the target language code, and the timestamp from the DOM
 */
export class CurrentSubtitleService {
    /** Modifier to decrease the possibility of synchronization errors, since the DOM time value lacks a milliseconds value */
    protected static readonly MILLISECONDS_ADDED_TO_VIKI_TIMING = 1000;

    private allSubtitlesProperty: AllSubtitles;
    private currentVideoIdProperty: CurrentVideoId;
    private targetLanguageCodeProperty: TargetLanguageCode;

    constructor(private allSubtitlesAccess: AllSubtitles,
                private currentVideoIdAccess: CurrentVideoId,
                private targetLanguageCodeAccess: TargetLanguageCode,
    ) {
        this.allSubtitlesProperty = allSubtitlesAccess;
        this.currentVideoIdProperty = currentVideoIdAccess;
        this.targetLanguageCodeProperty = targetLanguageCodeAccess;
    }

    public getCurrentSubtitle(timestampFromDom: string): string | null {
        if (!this.allSubtitlesProperty?.get()?.length) {
            return null;
        }
        const subtitlesOfSecondLanguage = this.allSubtitlesProperty.get().find(
            (subtitleData: SubtitleData) => {
                const isCorrectLanguage = subtitleData.language === this.targetLanguageCodeProperty.get();
                if (!isCorrectLanguage) {
                    return false;
                }
                const videoIdInSubtitle = subtitleData.url.split('/').find(
                    part => part === this.currentVideoIdProperty.get()
                )
                return videoIdInSubtitle === this.currentVideoIdProperty.get();
            }
        );
        if (!subtitlesOfSecondLanguage) {
            return null;
        }
        const correctTimestamp: SubtitleTimestampWithContent | null = this.findCorrectTimestampWithContent(subtitlesOfSecondLanguage.timestampsWithContent, timestampFromDom);
        return correctTimestamp ? correctTimestamp.content : null;
    }


    private findCorrectTimestampWithContent(timestamps: SubtitleTimestampWithContent[], timestampFromDom: string): SubtitleTimestampWithContent | null {
        if (!this.isTimestampFormatValid(timestampFromDom)) {
            throw new Error(`Invalid timestamp format: ${timestampFromDom}`);
        }
        const timePartsOfTimeInVikiEl = timestampFromDom.split(':').map(parseFloat);
        let hours = 0, minutes = 0, seconds = 0;
        if (timePartsOfTimeInVikiEl.length === 2) {
            [minutes, seconds] = timePartsOfTimeInVikiEl;
        } else if (timePartsOfTimeInVikiEl.length === 3) {
            [hours, minutes, seconds] = timePartsOfTimeInVikiEl;
        }
        const totalSecondsOfTimeInVikiEl = hours * 3600 + minutes * 60 + seconds;
        const currentTimeInMillisecondsBasedOnDiv = totalSecondsOfTimeInVikiEl * 1000;
        const adjustedCurrentTimeInMilliseconds = currentTimeInMillisecondsBasedOnDiv + CurrentSubtitleService.MILLISECONDS_ADDED_TO_VIKI_TIMING;

        return this.binarySearchTimestamps(timestamps, adjustedCurrentTimeInMilliseconds, 0, timestamps.length - 1);
    }

    private binarySearchTimestamps(timestamps: SubtitleTimestampWithContent[], targetTime: number, left: number, right: number): SubtitleTimestampWithContent | null {
        if (left > right) {
            return null;
        }
        const mid = Math.floor((left + right) / 2);
        if (timestamps[mid].startInMilliseconds > targetTime) {
            return this.binarySearchTimestamps(timestamps, targetTime, left, mid - 1);
        }
        if (timestamps[mid].endInMilliseconds < targetTime) {
            return this.binarySearchTimestamps(timestamps, targetTime, mid + 1, right);
        }
        return timestamps[mid];
    }

    /**
     * Assuming timestamp from dom is a string in the format "hh:mm:ss" or "mm:ss"
     */
    private isTimestampFormatValid(timestamp: string): boolean {
        const timeParts = timestamp.split(':');
        if (timeParts.length !== 2 && timeParts.length !== 3) {
            return false;
        }
        return timeParts.every(part => !isNaN(parseFloat(part)));
    }
}