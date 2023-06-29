import {pipe} from 'rxjs';
import { map } from 'rxjs/operators';

export function asEvent<T extends {type: string}>(type: T['type']) {
    return pipe(map((data) => ({type, data})));
}