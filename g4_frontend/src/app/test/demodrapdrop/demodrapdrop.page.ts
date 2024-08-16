import { AfterViewInit , Component , ViewChild , ElementRef, ViewChildren, QueryList , ChangeDetectorRef } from '@angular/core'; //OnInit
import { Gesture, GestureController, IonCard, IonItem } from '@ionic/angular';

@Component({
  selector: 'app-demodrapdrop',
  templateUrl: './demodrapdrop.page.html',
  styleUrls: ['./demodrapdrop.page.scss'],
})
export class DemodrapdropPage implements AfterViewInit {

  ladoIzquierdo:any[] = [];
  ladoDerecho:any[]   = [];
  //myArray       = Array.from(Array(30).keys());
  myArray:any[]   = Array.from(Array(10).keys());
  contentScrollActive = true;
  gestureArray: Gesture[] = [];

  @ViewChild('dropzoneA') dropA!: ElementRef;
  @ViewChild('dropzoneB') dropB!: ElementRef;

  //@ViewChildren(IonItem , {read: ElementRef}) items!: QueryList<ElementRef>
  @ViewChildren(IonCard , {read: ElementRef}) items!: QueryList<ElementRef>

  constructor(private gestureCtrl: GestureController , private changeDetectorRef: ChangeDetectorRef ) { }

  ngAfterViewInit(){
    this.updateGestures();
  } 

  //ngOnInit() {
  //}

  updateGestures(){
    console.log('my items:' , this.items);
    const arr = this.items.toArray();

    for (let i = 0; i < arr.length; i++) {
      const oneItem = arr[i];
      
      const drag = this.gestureCtrl.create({
         el: oneItem.nativeElement,
         threshold: 0,
         gestureName: 'drag',
         onStart: ev =>{
           oneItem.nativeElement.style.transition = '';
           oneItem.nativeElement.style.opacity = '0.8';
           oneItem.nativeElement.style.fontWeight = 'bold';
           this.contentScrollActive = false;
           this.changeDetectorRef.detectChanges();
         },
         onMove: ev =>{
          oneItem.nativeElement.style.transform = `translate(${ev.deltaX}px , ${ev.deltaY}px)`;
          oneItem.nativeElement.style.zIndex = 11;
          this.checkDropzoneHover(ev.currentX, ev.currentY);
         },
         onEnd: ev =>{
          this.contentScrollActive = true;
          this.handleDrop(oneItem, ev.currentX , ev.currentY, i);
         }
      });
      drag.enable();
      this.gestureArray.push(drag);
    }

    this.items.changes.subscribe(res => {
      console.log('items changed:', res)
      if(this.gestureArray.length != this.items.length){
        this.updateGestures();
      }
      
    })

    //https://www.youtube.com/watch?v=EULXLf4SldA

  }

  // Check if we are dragging above a dropzone
  checkDropzoneHover(x:any,y:any){
    const dropA = this.dropA.nativeElement.getBoundingClientRect();
    const dropB = this.dropB.nativeElement.getBoundingClientRect();

    if(this.isInZone(x, y, dropA)){
      this.dropA.nativeElement.style.backgroundColor = 'blue';
      this.dropA.nativeElement.style.opacity = '0.8';
    }else{
      this.dropA.nativeElement.style.backgroundColor = 'white';       
    }

    if(this.isInZone(x, y, dropB)){
      this.dropB.nativeElement.style.backgroundColor = 'red';
      this.dropB.nativeElement.style.opacity = '0.8';
    }else{
      this.dropB.nativeElement.style.backgroundColor = 'white';
    }

  }

  // Check if coordinates are within a dropzone rect 
  isInZone(x:any, y:any, dropzone:any){
    if(x < dropzone.left || x >= dropzone.right){
      return false;
    }
    if(y < dropzone.top || y >= dropzone.bottom){
      return false;
    }
    return true;
  }

  // Decide what to do with dropped item
  handleDrop(item:any, endX:any , endY:any , index:any){
    const dropA = this.dropA.nativeElement.getBoundingClientRect();
    const dropB = this.dropB.nativeElement.getBoundingClientRect();

    if(this.isInZone(endX , endY , dropA)){
      // Dropped in Zone A
      
      //let removedItem: never[] = [];
      //const removedItem = this.myArray.splice(index, 1);
      //removedItem = this.myArray.splice(index, 1);
      this.ladoIzquierdo.push(this.myArray.splice(index, 1));
      item.nativeElement.remove();
    }else if(this.isInZone(endX , endY , dropB)){
      // Dropped in Zone B
      
      this.ladoDerecho.push(this.myArray.splice(index, 1));
      item.nativeElement.remove();
    }else{
        // dont drop the item into a zone
        // simply bring it back to the initial position
        item.nativeElement.style.transition = '.2s ease-out';
        item.nativeElement.style.zIndex = 'inherit';
        item.nativeElement.style.transform = `translate(0,0)`;
        item.nativeElement.style.opacity = '1';
        item.nativeElement.style.fontWeight = 'normal';
    }
    this.dropA.nativeElement.style.backgroundColor = 'white';
    this.dropB.nativeElement.style.backgroundColor = 'white';
    this.changeDetectorRef.detectChanges();

  }


}
