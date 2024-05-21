export const appConfig = {
    domSelectors: {
        xhrInterceptDomStorage: '#simple-dual-subtitles__interceptedData',
        vikiSubtitleBoxClass: 'vjs-text-track-cue',
        vikiTimestampElement: '.vjs-current-time-display',
        vikiSubtitleSelector: ':not(.subtitle-box)',
    },
    files: {
        compiledStylesFile: 'styles.css',
    },
    events: {
        customXhrIntercept: 'vla-subtitle-xhr-intercept'
    },
    misc: {
        subtitleRequestUrlSubstring: 'auth_subtitles',
    },
};