import {injectable} from 'inversify';
import 'reflect-metadata';
import {Message} from '../../../common/communication/message';

@injectable()
export class DateService {
    async currentTime(): Promise<Message> {
        return {
            title: `Time`,
            body: new Date().toString(),
        };
    }
}
