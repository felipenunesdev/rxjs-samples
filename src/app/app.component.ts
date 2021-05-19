import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  forkJoin,
  from,
  fromEvent,
  interval,
  Observable,
  of,
  Subject,
  throwError,
  zip,
} from 'rxjs';
import {
  auditTime,
  concatAll,
  concatMap,
  debounceTime,
  delay,
  finalize,
  map,
  mergeAll,
  mergeMap,
  pairwise,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rxjs-samples';

  private values = [
    {
      name: 'Juan',
      edad: 33,
    },
    {
      name: 'Jose',
      edad: 21,
    },
    {
      name: 'Alberto',
      edad: 28,
    },
  ];

  public throttleTimeSubject = new Subject();
  public debounceTimeSubject = new Subject();
  public auditTimeSubject = new Subject();
  public timeForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.timeForm = this.fb.group({
        throttle: [null],
        debounce: [null],
        audit: [null]
    })

    this.finalizeSample();


    // this.mergeMapSample();
    // this.concatMapSample();
    // this.switchMapSample();

    this.throttleTimeSample();
    this.debounceTimeSample();
    this.auditTimeSample();
  }

  // CREATION OPERATORS
  private fromSample(): void {
    from([1, 2, 3, 4]).subscribe(console.log);
    from(new Promise((resolve) => resolve([1, 2, 3, 4]))).subscribe(console.log);
    from([{ id: 1 }, { id: 2 }]).subscribe(console.log);
    from('string').subscribe(console.log);
  }

  private ofSample(): void {
    of(2, 3, 4, 5).subscribe(console.log);
    of([2, 3, 4, 5], 20, { id: 17 }).subscribe(console.log);
  }

  private throwErrorSample(): void {
    throwError([2]).subscribe(
      (res) => console.log(`OK ${res}`),
      (err) => console.log(`ERROR ${err}`)
    );
  }

  // COMBINATION
  private zipSample(): void {
    const obs1 = of("string");
    const obs2 = of([4, 5, 6]);
    zip(obs1, obs2).subscribe(console.log);
  }

  private forkJoinSample(): void {
    const obs1 = of([1, 2, 3]);
    const obs2 = of([4, 5, 6]);
    forkJoin({obs1, obs2}).subscribe(console.log);
  }

  private pairwiseSample(): void {
    from([1, 2, 3])
      .pipe(pairwise())
      .subscribe(([prev, next]) => {
        console.log(prev);
        console.log(next);
      });
  }

  // TRANSFORMATION
  private mapSample(): void {
    from(this.values)
      .pipe(map((res) => res.name))
      .subscribe(console.log);
  }

  private mergeMapSample(): void {
    from(this.values)
      .pipe(
        delay(2000),
        mergeMap((res) => {
          return of(res).pipe(delay(5000));
        })
      )
      .subscribe(console.log);
  }

  private concatMapSample(): void {
    from(this.values)
      .pipe(
        delay(2000),
        concatMap((res) => {
          return of(res).pipe(delay(5000));
        })
      )
      .subscribe(console.log);
  }

  private switchMapSample(): void {
    fromEvent(document, 'click')
      .pipe(
        switchMap(() => interval(1000))
      )
      .subscribe(console.log);
  }

  //FILTERING
  private throttleTimeSample(): void {
    this.throttleTimeSubject.pipe(throttleTime(1000)).subscribe(console.log);
    this.timeForm.controls.throttle.valueChanges.subscribe((res) => {
      this.throttleTimeSubject.next(res);
    });
  }

  private debounceTimeSample(): void {
    this.debounceTimeSubject.pipe(debounceTime(1000)).subscribe(console.log);
    this.timeForm.controls.debounce.valueChanges.subscribe((res) => {
      this.debounceTimeSubject.next(res);
    });
  }

  private auditTimeSample(): void {
    this.auditTimeSubject.pipe(auditTime(500)).subscribe(console.log);
    this.timeForm.controls.audit.valueChanges.subscribe((res) => {
      this.auditTimeSubject.next(res);
    });
  }

  //UTILITY
  private tapSample(): void{
    from([1,2,3]).pipe(tap(res => console.log(`tap sample ${res}`))).subscribe(console.log)
  }
  private finalizeSample(): void{
    from([1,2,3]).pipe(finalize(() => console.log(`finalize sample`))).subscribe(console.log)
  }
}
