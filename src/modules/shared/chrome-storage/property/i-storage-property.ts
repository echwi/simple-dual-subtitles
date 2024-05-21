import {Observable} from "rxjs";

export interface IStorageProperty<T> {
    init(key: string): Promise<void>;
    get(): T;
    set(value: T): Promise<void>;
    onChanged(): Observable<T>;
}