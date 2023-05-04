import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { UtilityService } from '../../shared/services/utility/utility.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Store } from '@ngxs/store';
import { PushNotifications, PushNotificationSchema, PushNotificationToken } from '@capacitor/push-notifications';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    private http = inject(HttpClient);
    private utility = inject(UtilityService);
    private navigation = inject(NavigationService);
    private store = inject(Store);


    // async initListerners(): Promise<void> {
    //     console.error('initListerners: ');
    //     PushNotifications.addListener('registrationError', (error: any) => {
    //         console.log('Error: ' + JSON.stringify(error));
    //     });

    //     PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
    //         console.log('Push received: ', notification);
    //         this.utility.presentAlert(JSON.stringify(notification));
    //     }
    //     );

    //     PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
    //         const data = notification.notification.data;
    //         // console.log('Action performed: ' + JSON.stringify(notification.notification));
    //         if (data.detailsId) {
    //             alert('pushNotificationActionPerformed');
    //             this.navigation.navigateForwardParams(`/fcm-details`, notification.notification);
    //         }
    //     });

    // }

    // async initPush() {
    //     let permStatus = await PushNotifications.checkPermissions();
    //     if (permStatus.receive !== 'granted') {
    //         this.utility.presentAlert('User denied permissions!');
    //         throw new Error('User denied permissions!');
    //     }
    //     await PushNotifications.requestPermissions()
    //         .then(async (permission) => {
    //             if (permission.receive == 'granted') {
    //                 await PushNotifications.register();
    //                 PushNotifications.addListener('registration', async (token: PushNotificationToken) => {
    //                     console.log('My token: ' + JSON.stringify(token));
    //                 }
    //                 );
    //             }
    //         });
    // }
}
