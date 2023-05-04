import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

export class IPasswordlessStateModel { }
@State<IPasswordlessStateModel>({
    name: 'passwordless',
})
@Injectable()
export class PasswordlessState {
}
