import {appConfig} from "../../../app-config";
import {Subject} from "rxjs";
import {CurrentSubtitleService} from "../current-subtitle-service/current-subtitle-service";

export class DomService {
    private currentVikiSubtitle: string | null;
    private currentVikiSubtitle$: Subject<string> = new Subject<string>();
    private currentSecondSubtitle: string | null = null;
    private currentSubtitleService: CurrentSubtitleService;

    constructor(currentSubtitleService: CurrentSubtitleService) {
        this.currentSubtitleService = currentSubtitleService;
        this.currentVikiSubtitle$.subscribe((vikiSubtitle: string) => {
            const currentTimestampFromDom = this.getCurrentTimestampFromVikiEl();
            if (!currentTimestampFromDom) {
                return;
            }
            this.currentSecondSubtitle = this.currentSubtitleService.getCurrentSubtitle(currentTimestampFromDom)
            if (!this.currentSecondSubtitle) {
                return;
            }
            this.renderTemplate();
        });
        this.observeCurrentVikiSubtitle();
    }

    private renderTemplate(): void {
        const vikiSubtitleBox = document.querySelector('.' + appConfig.domSelectors.vikiSubtitleBoxClass);
        if (!vikiSubtitleBox) {
            return;
        }
        const box = document.createElement('div');
        box.className = 'subtitle-box';
        const content = document.createElement('div');
        content.className = 'subtitle-box__content';
        content.textContent = this.currentSecondSubtitle;
        box.appendChild(content);
        vikiSubtitleBox.insertBefore(box, vikiSubtitleBox.firstChild);
    }

    private getCurrentTimestampFromVikiEl() {
        const vikiElWithCurrentTime = document.querySelector(appConfig.domSelectors.vikiTimestampElement);
        if (!vikiElWithCurrentTime) {
            return null;
        }
        return vikiElWithCurrentTime.textContent; // Assuming a format of "hh:mm:ss" or "mm:ss"
    }

    private observeCurrentVikiSubtitle() {
        let observerScope = document.body;
        let observerScopeNarrowedDown = false;
        const { vikiSubtitleBoxClass, vikiSubtitleSelector } = appConfig.domSelectors;

        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (!mutation.addedNodes.length || !this.filterChildListMutations(mutation)) {
                    continue;
                }
                let currentVikiSubtitleWrapper = null;
                for (let node of mutation.addedNodes) {
                    if (node instanceof Element && node.classList.contains(vikiSubtitleBoxClass)) {
                        currentVikiSubtitleWrapper = node;
                        break;
                    }
                }
                if (!currentVikiSubtitleWrapper) {
                    continue;
                }
                if (!observerScopeNarrowedDown) {
                    observerScope = currentVikiSubtitleWrapper.parentElement?.parentElement;
                    if (observerScope) {
                        observer.disconnect();
                        observer.observe(observerScope, { childList: true, subtree: true });
                        observerScopeNarrowedDown = true;
                        return;
                    }
                }
                const vikiSubtitleElement = currentVikiSubtitleWrapper.querySelector(vikiSubtitleSelector);
                if (!vikiSubtitleElement) {
                    continue;
                }
                const vikiSubtitleText = vikiSubtitleElement.textContent;
                if (this.currentVikiSubtitle === vikiSubtitleText) {
                    continue;
                }

                this.currentVikiSubtitle = vikiSubtitleText;
                this.currentVikiSubtitle$.next(vikiSubtitleText);
            }
        });

        observer.observe(observerScope, { childList: true, subtree: true });
    }


    private filterChildListMutations(mutation: MutationRecord): boolean {
        return mutation.type === 'childList';
    }
}