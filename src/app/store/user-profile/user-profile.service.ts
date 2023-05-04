import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserProfileStateService {
    headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

    constructor(
        private httpClient: HttpClient,
    ) { }
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
        return this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, profileForm, { headers: this.headers });
    }
    public loadUser(userId: string) {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
    public uploadData(formData: FormData, userId?: string) {
        return this.httpClient.post(environment.BASE_PATH + '/api/upload', formData)
            .pipe()
            .subscribe((response: any) => {
                if (response) {
                    const fileId = response[0].id;
                    if (userId) {
                        this.httpClient.put(environment.BASE_PATH + '/api/users/' + userId, {
                            data: {
                                attachments: fileId,
                            },
                            avatar: fileId,
                        }).subscribe((res: any) => {
                            if (res) {
                                this.loadUser(res.id).subscribe((res: any) => {
                                    console.log(res);
                                });
                            }
                        });
                    }
                }
            });
    }
}
