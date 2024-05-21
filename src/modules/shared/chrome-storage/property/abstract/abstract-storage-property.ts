import {Observable, Subject} from 'rxjs';
import {IStorageProperty} from '../i-storage-property';

export abstract class AbstractStorageProperty<T> implements IStorageProperty<T> {
    protected key: string;
    protected observable: Subject<T>;
    protected value: T;

    private constructor() {
    }

    public async init(key: string): Promise<void> {
        this.key = key;
        this.observable = new Subject<T>();
        return new Promise((resolve, reject) => {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes[this.key]) {
                    this.value = changes[this.key].newValue;
                    this.observable.next(this.value);
                }
            });

            chrome.storage.local.get([this.key], (result) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    this.value = result[this.key];
                    resolve();
                }
            });
        });
    }

    public get(): T {
        return this.value;
    }

    public async set(value: T): Promise<void> {
        const setPromise = new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({[this.key]: value}, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                resolve();
            });
        });

        try {
            await setPromise;
        } catch (error) {
            console.error(error);
        }
    }

    public onChanged(): Observable<T> {
        return this.observable.asObservable();
    }
}