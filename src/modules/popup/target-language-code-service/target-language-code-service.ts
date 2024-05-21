import {TargetLanguageCode} from "../../shared/chrome-storage/property/target-language-code";

export class TargetLanguageCodeService {
    private readonly targetLanguageCodeSelect: HTMLSelectElement;
    private targetLanguageCodeProperty: TargetLanguageCode;
    constructor(
        private readonly targetLanguageCodeSelect: HTMLSelectElement,
        private targetLanguageCodeProperty: TargetLanguageCode
    ) {
        this.targetLanguageCodeSelect = targetLanguageCodeSelect;
        this.initializeSelectChangeEventListener()
    }

    private initializeSelectChangeEventListener() {
        this.targetLanguageCodeSelect.addEventListener(
            'change', async (event) => {
            const selectedLanguage = (event.target as HTMLSelectElement).value;
            this.targetLanguageCodeProperty.set(selectedLanguage).catch(console.error)
        });
    }
}