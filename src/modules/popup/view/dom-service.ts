import {
    calculateAvailableLanguages
} from "../../shared/chrome-storage/property/helper/calculate-available-languages";
import {AllSubtitles} from "../../shared/chrome-storage/property/all-subtitles";
import {CurrentVideoId} from "../../shared/chrome-storage/property/current-video-id";
import {TargetLanguageCode} from "../../shared/chrome-storage/property/target-language-code";
import {TargetLanguageCodeService} from "../target-language-code-service/target-language-code-service";
import {appConfig} from "../../../app-config";

export class DomService {
    public subTitleSelect: HTMLSelectElement;

    private readonly allSubtitlesProperty: AllSubtitles;
    private readonly currentVideoIdProperty: CurrentVideoId;
    private readonly targetLanguageCodeProperty: TargetLanguageCode;

    constructor(private readonly allSubtitlesProperty: AllSubtitles,
                private readonly currentVideoIdProperty: CurrentVideoId,
                private readonly targetLanguageCodeProperty: TargetLanguageCode,
    ) {
        this.allSubtitlesProperty = allSubtitlesProperty;
        this.currentVideoIdProperty = currentVideoIdProperty;
        this.targetLanguageCodeProperty = targetLanguageCodeProperty;
        this.addStyleSheetsToPopup();
        this.subTitleSelect = this.getSelectDomReference();
        this.initOrUpdate();
        this.allSubtitlesProperty.onChanged().subscribe(() => this.initOrUpdate());
        this.currentVideoIdProperty.onChanged().subscribe(() => this.initOrUpdate());
        new TargetLanguageCodeService(this.subTitleSelect, this.targetLanguageCodeProperty);
    }

    private initOrUpdate(): void {
        this.clearSelectSubtitleSelect();
        this.handleAvailableLanguageOptions();
        this.selectTargetLanguageBasedOnSate();
    }

    private getSelectDomReference(): HTMLSelectElement {
        return document.getElementById('targetLanguage') as HTMLSelectElement;
    }

    private clearSelectSubtitleSelect(): void {
        this.subTitleSelect.innerHTML = '';
    }

    private handleAvailableLanguageOptions(): void {
        const availableLanguageCodes: string[] = calculateAvailableLanguages(
            this.currentVideoIdProperty.get(),
            this.allSubtitlesProperty.get()
        );
        if (availableLanguageCodes.length < 1) {
            document.getElementById('selectWrapper').style.display = 'none';
            document.getElementById('selectUnavailableInfo').style.display = 'block';
            return;
        }
        document.getElementById('selectWrapper').style.display = 'block';
        document.getElementById('selectUnavailableInfo').style.display = 'none';
        availableLanguageCodes.forEach(code => {
            const optionElement = document.createElement('option');
            optionElement.value = code;
            optionElement.textContent = code;
            this.subTitleSelect.appendChild(optionElement);
        });
    }

    private selectTargetLanguageBasedOnSate() {
        if (!this.targetLanguageCodeProperty.get()) {
            return;
        }
        this.subTitleSelect.value = this.targetLanguageCodeProperty.get();
    }

    private addStyleSheetsToPopup(): void {
        document.head.insertAdjacentHTML(
            'beforeend',
            `<link type="text/css" rel="stylesheet" href="${appConfig.files.compiledStylesFile}">`
        );
    }
}