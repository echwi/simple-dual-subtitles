import {AbstractStorageProperty} from './abstract/abstract-storage-property';

export class CurrentVideoId extends AbstractStorageProperty<string | null> {
    private constructor() {
        super();
    }

    async init(): Promise<void> {
        return super.init('currentVideoId');
    }
}