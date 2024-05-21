export interface SubtitleTimestampWithContent {
    startInMilliseconds: number;
    endInMilliseconds: number;
    content: string;
}

export class SubtitleData {
    constructor(
        public videoId: string,
        public language: string,
        public url: string,
        public fulltext: string,
        public timestampsWithContent: SubtitleTimestampWithContent[],
    ) {
    }
}