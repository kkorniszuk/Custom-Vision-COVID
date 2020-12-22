import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { HttpService } from './services/http.service';
import { TagEnum } from './enums/tag-enum';
import { delay } from 'rxjs/operators';

interface MicrosoftWebApiResultInterface {
  probability: number;
  tagName: TagEnum;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public results: MicrosoftWebApiResultInterface[] = [];

  private videoWidth = 0;
  private videoHeight = 0;

  @ViewChild('video', {static: true}) videoElement: ElementRef;
  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  constraints = {
    video: {
      facingMode: 'environment',
      width: {ideal: 1024},
      height: {ideal: 512}
    }
  };

  constructor(private renderer: Renderer2, private httpService: HttpService, private cd: ChangeDetectorRef) {
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.startCamera();
    setInterval(() => {
      this.checkMaskManually();
    }, 5000);
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  checkMaskManually() {
    this.capture();
    this.canvas.nativeElement.toBlob((blobObject) => {
      if (blobObject) {
        this.httpService.checkMask(blobObject).subscribe((response) => {
          const highestValue = response.predictions.reduce ((prev, current) => (prev.probability > current.probability) ? prev : current);
          this.results = [...this.results, {
            probability: highestValue.probability,
            tagName: TagEnum[highestValue.tagName as keyof typeof TagEnum]
          }];
          delay(1000);
          this.cd.detectChanges();
        });
      } else {
        console.error('Something is wrong with blob!');
      }
    });
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  private capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }
}
