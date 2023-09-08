import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  openConfirm(message: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: message,
    });

    return dialogRef.afterClosed();
  }

}
