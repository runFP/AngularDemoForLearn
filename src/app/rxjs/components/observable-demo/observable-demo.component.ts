import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, interval, merge, Observable, of, pipe, range, Subject} from 'rxjs';
import {map, filter, scan} from 'rxjs/operators';
import {
  concatAll, debounceTime,
  defaultIfEmpty,
  delay,
  mergeAll,
  startWith,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  timeInterval
} from 'rxjs/internal/operators';

@Component({
  selector: 'app-observable-demo',
  templateUrl: './observable-demo.component.html',
  styleUrls: ['./observable-demo.component.scss']
})
export class ObservableDemoComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  ngOnInit() {
  }

  // 高阶
  // concatAll等价于 concurrency 参数(最大并发数)为1的 mergeAll
  /**
   * concatAll()会订阅每一个出现的Observable的内部observable（例如b内部有个a，就会订阅a）,
   * 重点需要注意的是，它会在复制所有observable发射的值，直到observable完成（complete），才会继续订阅下一个，
   * 可以观察下面那个结合rang，每次延迟1秒发射值
   * */
  concatAll(): void {
    console.log('---------------------concatAll begin-------------------');
    console.log('concatAll把subscribe订阅后还是Observable打平，直接变成值');
    pipe(map(x => x))(of(of(1), of(2))).subscribe(x => {
      console.log('没使用concatAll之前，emit的是observable');
      console.log(x);
    });
    pipe(map(x => x), concatAll())(of(of(1), of(2))).subscribe(x => {
      console.log('使用concatAll之后，他把每一个emit的observable订阅后(subscribe)再next它的值');
      console.log(x);
    });
    console.log('------------------concatAll begin-----------------------');

    // 感受对比一下mergeAll
    /*fromEvent(document, 'click').pipe(map(x => {
      console.log('!!!');
      return interval(1000);
    }), concatAll()).subscribe(x => console.log(x));*/
  }

  // mergeAll会把每一个observable合并后打平，！！！即使是新增的observable,但concatAll不会加入新增observable，只是把第一次流进来的observable打平
  mergeAll(): void {
    fromEvent(document, 'click').pipe(map(x => {
      console.log('!!!');
      return interval(1000);
    }), mergeAll()).subscribe(x => console.log(x));
  }

  // subject
  subject(): void {
    const subject = new Subject<number>();

    subject.subscribe({
      next: (v) => console.log(`observerA: ${v}`)
    });
    subject.subscribe({
      next: (v) => console.log(`observerB: ${v}`)
    });

    subject.next(1);
    subject.next(2);

    const s1 = subject.pipe(map(x => x * 2));
    s1.subscribe({
      next: v => console.log(`after1 pipe(): ${v}`)
    });
    s1.subscribe({
      next: v => console.log(`after2 pipe(): ${v}`)
    });

    (<Subject<number>>s1).next(3);
  }

  // 创建
  rang(): void {
    /**
     * concatAll()会订阅每一个出现的Observable的内部observable（例如b内部有个a，就会订阅a）,
     * 重点需要注意的是，它会在复制所有observable发射的值，直到observable完成（complete），才会继续订阅下一个
     * 当第一个带着1的observable到来时，会先复制他的值1，然后等其执行完毕，才去执行下一个带2的observable，延迟了1秒，递推因此这里每一个生成数都被递增的延迟了一秒
     * */
    // 把rang生成的每个数都往后推迟1秒
    range(10, 10).pipe(map(x => of(x).pipe(delay(1000))), concatAll()).subscribe(x => console.log(x));
    // // 把range推迟1秒
    // range(10, 10).pipe(delay(3000)).subscribe(x => console.log(x));
    //
    // // range(10, 10).pipe(timeinterval()).subscribe(x => console.log(x));
    // const seconds = interval(1000);

    // of(1).pipe(map(x => of(x * 2)), concatAll()).subscribe(x => console.log(x));
  }

  goOf() {
    of(of([1, 2, 3]).subscribe(res => console.log('res:' + res))).subscribe(res => console.log(res));
    return of(of([1, 2, 3]).subscribe(res => {
      return of(res);
    }));
  }

  getOf() {
    this.goOf().subscribe(res => res.unsubscribe());
  }

  eventFrom() {
    const a = true;
    const rr = fromEvent(document, 'click').pipe(filter(ev => a), switchMap(x => of(x))).subscribe(r => {
      console.log('r:', r);
      rr.unsubscribe();
    });
  }

  switchMap() {
    const switched = of(1, 2, 3).pipe(switchMap((x: number) => of(x, x ** 2, x ** 3)));
    switched.subscribe(x => console.log(x));
  }

  @ViewChild('abc', {static: false}) abc: ElementRef;

  ngAfterViewInit(): void {
    const test = true;
    const open$ = fromEvent(this.abc.nativeElement, 'mouseenter').pipe(filter(() => test),
      switchMap(enterEvent => fromEvent(document, 'mousemove').pipe(
        startWith(enterEvent),
        debounceTime(300),
        filter(event => this.abc.nativeElement === event['target'])
      ))).subscribe(x => console.log('!!!!!!!!!!!!!1'));
  }
}
