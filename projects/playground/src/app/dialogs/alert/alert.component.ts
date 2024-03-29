import {Component, OnInit} from '@angular/core';

import {LazyDialogRef} from '../../../../../ngx-lazy-dialog/src/lib';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  public model: string;

  public constructor(private _ref: LazyDialogRef) {}

  public ngOnInit(): void {
    console.log(this._ref?.data);
  }
}
