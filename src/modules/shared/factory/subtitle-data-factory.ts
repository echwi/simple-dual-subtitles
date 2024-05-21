import { SubtitleData, SubtitleTimestampWithContent } from "../model/subtitle-data";
import { ISubtitleDataFactory } from "./i-subtitle-data-factory";

export class SubtitleDataFactory implements ISubtitleDataFactory {
    static instance: SubtitleDataFactory | null = null;

    static URL_LANGUAGE_REGEX = /\/([a-z]{2})\.vtt/i;
    static VIDEO_ID_REGEX = /videos\/(\d+v\w*)/;

    create(subtitleFetchUrl: string, rawResponseString: string): SubtitleData {
        const videoId: string = this.extractVideoId(subtitleFetchUrl);
        const videoLanguage: string = this.extractVideoLanguage(subtitleFetchUrl)
        return new SubtitleData(
            videoId,
            videoLanguage,
            subtitleFetchUrl,
            rawResponseString,
            this.splitFullTextIntoArray(rawResponseString)
        );
    }

    private splitFullTextIntoArray(text: string): SubtitleTimestampWithContent[] {
        const lines = text.split('\n');
        const timestampsWithContent: SubtitleTimestampWithContent[] = [];
        const responseTimeStampPattern = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const match = trimmedLine.match(responseTimeStampPattern);
            if (!match || match.length !== 3) {
                return;
            }
            const startInMilliseconds: number = this.timeCodeToMilliseconds(match[1]);
            const endInMilliseconds: number = this.timeCodeToMilliseconds(match[2]);
            const content = lines[index + 1]?.trim() ?? '';
            timestampsWithContent.push({ startInMilliseconds, endInMilliseconds, content });
        });
        return timestampsWithContent;
    }

    /**
     * @param timeCode - hh:mm:ss.mmm
     **/
    private timeCodeToMilliseconds(timeCode: string): number {
        const [hoursMinutesAndSeconds, milliseconds] = timeCode.split('.');
        const [hours, minutes, seconds] = hoursMinutesAndSeconds.split(':').map(Number);
        return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + parseInt(milliseconds);
    }

    private extractVideoId(subtitleFetchUrl): string {
        const match = subtitleFetchUrl.match(SubtitleDataFactory.VIDEO_ID_REGEX);
        if (!(match && match[1])) {
            return;
        }

        return match[1]
    }

    private extractVideoLanguage(subtitleFetchUrl): string {
        const match: RegExpMatchArray = subtitleFetchUrl.match(SubtitleDataFactory.URL_LANGUAGE_REGEX);
        if (!(match && match[1])) {
            return;
        }

        return match[1]
    }

    static getOrInstantiateSubtitleDataFactory(): SubtitleDataFactory {
        if (!SubtitleDataFactory.instance) {
            SubtitleDataFactory.instance = new SubtitleDataFactory();
        }
        return SubtitleDataFactory.instance;
    }
}

SubtitleDataFactory.getOrInstantiateSubtitleDataFactory();