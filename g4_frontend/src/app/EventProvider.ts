import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventsProvider {

private dataCompanySubject = new Subject();

publishDataCompany(data: any) {
this.dataCompanySubject.next(data);
}

observeDataCompany(): Subject<any> {
    return this.dataCompanySubject;
}
}