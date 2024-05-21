import {AbstractStorageProperty} from './abstract/abstract-storage-property';

export class TargetLanguageCode extends AbstractStorageProperty<string> {
    private constructor() {
        super();
    }

    async init(): Promise<void> {
        return super.init('targetLanguageCode');
    }
}

