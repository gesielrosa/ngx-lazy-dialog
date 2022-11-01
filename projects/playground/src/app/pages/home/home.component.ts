import {Component} from '@angular/core';

import {LazyDialogService} from '../../../../../ngx-lazy-dialog/src/lib';
import {AlertComponent} from '../../dialogs/alert/alert.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(private _dialog: LazyDialogService) {}

  public async openDialog(): Promise<void> {
    const module = await import('../../dialogs/alert/alert.module').then((m) => m.AlertModule);

    const options = {
      module,
      data: {
        title: 'Alert',
      },
    };

    const dialog = await this._dialog.create<{title: string}, {confirm: boolean}, AlertComponent>(options);

    dialog.onClose().then((result: any) => {
      console.log(result);
    });

    setTimeout(() => dialog.close({confirm: true}), 5000);
  }

  public async openStandaloneDialog(): Promise<void> {
    const component = await import('../../dialogs/standalone-alert/standalone-alert.component').then(
      (m) => m.StandaloneAlertComponent
    );

    const options = {
      component,
      data: {
        title: 'Standalone Alert',
      },
    };

    const dialog = await this._dialog.create<{title: string}, {confirm: boolean}>(options);

    dialog.onClose().then((result) => {
      console.log(result);
    });

    setTimeout(() => dialog.close({confirm: true}), 5000);
  }
}
