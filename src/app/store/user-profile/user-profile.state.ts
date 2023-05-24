import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Action, StateContext, Store } from "@ngxs/store";
import { UserProfileActions } from "./user-profile.actions";
import { UserProfileStateService } from "./user-profile.service";
import { AuthStateActions } from "../auth/auth.actions";
import { Subject, takeUntil } from "rxjs";

export class UserProfileModel {
}

@State({
    name: 'userProfile',
})
@Injectable()
export class UserProfileState implements OnDestroy {

    private store = inject(Store);
    private service = inject(UserProfileStateService);
    subscription = new Subject();

    @Action(UserProfileActions.UpdateDarkMode)
    updateDarkMode(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateDarkMode): void {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isDarkMode: action.isDarkMode,
        });
    }
    @Action(UserProfileActions.UpdateFcmAccepted)
    updateFcmAccepted(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateFcmAccepted): void {
        const state = ctx.getState();
        // console.log(state);
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        this.service.updateStrapiUserFcm(userId, action.fcmAccepted, '123').pipe(
            takeUntil(this.subscription),
        ).subscribe((user) => {
            console.log(user);
        });
        ctx.patchState({
            ...state,
            fcmAccepted: action.fcmAccepted,
        });
    }
    @Action(UserProfileActions.UpdateStrapiUser)
    async updateStrapiUser(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateStrapiUser): Promise<void> {
        // console.log(action);
        const state = ctx.getState();
        // console.log(state);
        const userId = await this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        // console.log(userId);
        if (userId) {
            this.service.updateStrapiUserProfile(userId, action.userForm).pipe(
                takeUntil(this.subscription),
            ).subscribe(() => {
                this.store.dispatch(new AuthStateActions.LoadStrapiUser(userId));
            });
        }
    }
    @Action(UserProfileActions.UploadImage)
    uploadImage(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UploadImage): void {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        this.service.uploadData(action.imageForm, userId);
        this.store.dispatch(new AuthStateActions.LoadStrapiUser(userId));

    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
