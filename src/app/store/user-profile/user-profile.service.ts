import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy, inject } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable, Subject, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthStateActions } from "../auth/auth.actions";
import { ICustomer } from "src/app/shared/types/types.interfaces";

@Injectable({
    providedIn: 'root'
})
export class UserProfileStateService implements OnDestroy {
    headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    headersJson = new HttpHeaders().set('Content-Type', 'application/json');
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'multipart/form-data',
        }),
        withCredentials: true,
    };
    // private store = inject(Store);

    private httpClient = inject(HttpClient);

    subscription = new Subject();

    uploadStrapiImageToServer(formData: FormData): Observable<ICustomer> {
        return this.httpClient.post(environment.BASE_PATH + '/api/upload', formData);
    }
    setProfileImage(userId: string, fileId: number) {
        const postData: any = {
            data: {
                attachments: fileId,
            },
            avatar: fileId,
        }
        return this.httpClient.put(`${environment.BASE_PATH}/api/users/${userId}`, postData);
    }
    updateStrapiUserFcm(userId: string, accepted_fcm: boolean, device_token: string): Observable<ICustomer> {
        const postData = {
            accepted_fcm: accepted_fcm,
            device_token: '123',
        }
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, postData);
    }
    updateStrapiUserProfile(userId: string, profileForm: any): Observable<ICustomer> {
        const data = {
            email: profileForm?.email,
            first_name: profileForm?.first_name,
            last_name: profileForm?.last_name,
            username: profileForm?.username,
        };
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, data);
    }
    loadUser(userId: string): Observable<ICustomer> {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
