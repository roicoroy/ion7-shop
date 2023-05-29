import { Injectable } from "@angular/core";
import { AlertController, AlertOptions } from "@ionic/angular";
import { State, Store, Action, StateContext } from "@ngxs/store";
import { ErrorLoggingActions } from "./error-logging.actions";

export class ErrosStateModel {
    errorEntry: any[];
}

@State({
    name: 'errorsLogging',
    defaults: {
        errorEntry: null,
    }
})
@Injectable()
export class ErrorLoggingState {
    errorsList: Error[] = [];

    constructor(
        public alertCtrl: AlertController,
        private store: Store,
    ) { }

    @Action(ErrorLoggingActions.LogErrorEntry)
    logErrorEntry(ctx: StateContext<unknown>, action: ErrorLoggingActions.LogErrorEntry): void {
        const error = action.payload;
        this.errorsList.push(error);
        ctx.patchState({
            errorEntry: this.errorsList,
        });
    }
    @Action(ErrorLoggingActions.ClearErrorEntry)
    clearErrprEntry(ctx: StateContext<unknown>): void {
        this.errorsList = [];
        ctx.patchState({
            errorEntry: null,
        });
    }
    async presentErrorAlert(error: any) {
        const alertOptions: AlertOptions = {
            header: 'Alert!',
            subHeader: '',
            message: error,
            cssClass: 'alert-error',
            buttons: [
                {
                    text: 'OK',
                    role: 'confirm',
                    handler: () => {
                        // console.log('clear');
                        setTimeout(() => {
                            this.store.dispatch(new ErrorLoggingActions.ClearErrorEntry());
                        }, 1000);
                    },
                },
            ],
            backdropDismiss: true,
            translucent: true,
            animated: true,
            mode: 'ios',
            keyboardClose: true,
            id: 'alert-error',
        }

        const alert = await this.alertCtrl.create(
            alertOptions
        );

        await alert.present();
    }
}
