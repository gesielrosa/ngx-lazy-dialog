import {Component, OnInit} from '@angular/core';

import {LazyDialogService} from '../../../../../ngx-lazy-dialog/src/lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private _dialog: LazyDialogService) {}

  ngOnInit(): void {}

  public async openDialog(): Promise<void> {
    const module = await import('../../dialogs/alert/alert.module').then((m) => m.AlertModule);

    const dialog = await this._dialog.create(module, {
      title: 'Alert',
    });

    dialog.onClose().then((result: any) => {
      console.log(result);
    });

    setTimeout(() => dialog.close({confirm: true}), 5000);
  }
}
