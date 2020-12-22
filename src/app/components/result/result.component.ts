import { Component, Input, OnInit } from '@angular/core';
import { TagEnum } from '../../enums/tag-enum';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() probability: number;
  @Input() tagName: TagEnum;

ngOnInit() {
  // console.log(this.probability);
}
  public get tagEnum(): typeof TagEnum {
    return TagEnum;
  }

  public getTagString(currentContext: number) {
  return TagEnum[currentContext];
  }
}
