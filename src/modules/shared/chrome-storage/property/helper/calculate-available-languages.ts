import {SubtitleData} from "../../../model/subtitle-data";

export function calculateAvailableLanguages(currentVideoId: string | null, allSubtitles: SubtitleData[] | null): string[] {
    if (!currentVideoId || !allSubtitles || (allSubtitles.length < 1)) {
        return [];
    }
    return allSubtitles.filter(subtitleData => {
        const parts: string[] = subtitleData.url.split('/');
        const videoIdInSubtitle: string | undefined = parts.find(part => part === currentVideoId);
        return videoIdInSubtitle === currentVideoId;
    }).map(subtitleData => subtitleData.language);
}