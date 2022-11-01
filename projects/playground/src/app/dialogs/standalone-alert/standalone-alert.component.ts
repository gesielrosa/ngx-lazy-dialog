import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {LazyDialogRef} from '../../../../../ngx-lazy-dialog/src/lib';

@Component({
  selector: 'app-standalone-alert',
  templateUrl: './standalone-alert.component.html',
  styleUrls: ['./standalone-alert.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class StandaloneAlertComponent implements OnInit {
  public model: string;

  public constructor(private _ref: LazyDialogRef) {}

  public ngOnInit(): void {
    console.log(this._ref?.data);
  }
}
