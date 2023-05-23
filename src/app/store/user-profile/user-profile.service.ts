import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy, inject } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthStateActions } from "../auth/auth.actions";

@Injectable({
    providedIn: 'root'
})
export class UserProfileStateService implements OnDestroy {
    headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

    // private store = inject(Store);

    private httpClient = inject(HttpClient);

    subscription = new Subject();

    uploadStrapiImageToServer(formData: FormData): Observable<any> {
        return this.httpClient.post(environment.BASE_PATH + '/api/upload', formData, { headers: this.headers });
    }
    setProfileImage(userId: string, fileId: number): Observable<any> {
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, {
            data: {
                attachments: fileId,
            },
            avatar: fileId,
        }, { headers: this.headers });
    }
    public updateStrapiUserFcm(userId: string, accepted_fcm: boolean, device_token: string): Observable<any> {
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, {
            accepted_fcm: accepted_fcm,
            device_token: '123',
        }
        );
    }
    public updateStrapiUserProfile(userId: string, profileForm: any): Observable<any> {
        const data = {
            email: profileForm?.email,
            first_name: profileForm?.first_name,
            last_name: profileForm?.last_name,
            username: profileForm?.username,
        };
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, data);
    }
    public loadUser(userId: string) {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
    public uploadData(formData: FormData, userId?: string) {
        return this.httpClient.post(environment.BASE_PATH + '/api/upload', formData, { headers: this.headers })
            .pipe(
                takeUntil(this.subscription),
            )
            .subscribe((response: any) => {
                if (response.length > 0) {
                    const fileId = response[0].id;
                    if (userId) {
                        this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, {
                            data: {
                                attachments: fileId,
                            },
                            avatar: fileId,
                        })
                        // .pipe(
                        //     takeUntil(this.subscription),
                        // ).subscribe((res: any) => {
                        //     if (res) {
                        //         this.store.dispatch(new AuthStateActions.LoadStrapiUser(res.id));
                        //     }
                        // });
                    }
                }
            });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
