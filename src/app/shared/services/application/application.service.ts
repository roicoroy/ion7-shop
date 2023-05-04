import { Injectable, NgZone } from '@angular/core';
import { BatteryInfo, Device, DeviceId, DeviceInfo, GetLanguageCodeResult } from '@capacitor/device';
import { App, AppInfo, AppState, URLOpenListenerEvent } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { isPlatform } from '@ionic/angular';

export const packageUrl = 'app://uk.shop.mobile';
const iosOrAndroid = isPlatform('hybrid');

export const callbackUri = iosOrAndroid
    ? `packagepackage`
    : 'http://localhost:4200';


@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(
        private zone: NgZone,
    ) { }

    async initAppListeners() {
        console.log('appUrlOpen listener init AppService')
        await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            console.log('appUrlOpen listener init AppService',);
            console.log(event);
            this.zone.run(() => {
                console.log('appUrlOpen zone run');
                const slug = event.url.split(".app").pop();
                console.log(slug);
            });
        });
        await App.addListener('appStateChange', (state: AppState) => {
            console.log(state);
        });
    }

    async canOpenUrl(url: string): Promise<{ value: boolean }> {
        return AppLauncher.canOpenUrl({ url });
    }

    async exitApp(): Promise<void> {
        return App.exitApp();
    }
    async getLaunchUrl(): Promise<string> {
        const result = await App.getLaunchUrl();

        return result.url;
    }
    async openUrl(url: string): Promise<{ completed: boolean }> {
        return AppLauncher.openUrl({ url });
    }

    /**
     * Get App UUID
     * @returns Promise of boolean
     */
    async getDeviceId(): Promise<DeviceId> {
        return Device.getId();
    }

    /**
     * Obtains device Info
     * @returns Promise of DeviceInfo
     */
    async getDeviceInfo(): Promise<DeviceInfo> {
        return Device.getInfo();
    }

    /**
     * Obtains device battery Info
     * @returns Promise of DeviceBatteryInfo
     */
    async getDeviceBatteryInfo(): Promise<BatteryInfo> {
        return Device.getBatteryInfo();
    }

    /**
     * Obtains device Language Info
     * @returns Promise of DeviceLanguageCodeResult
     */
    async getDeviceLanguageCode(): Promise<GetLanguageCodeResult> {
        return Device.getLanguageCode();
    }
    /**
     * Obtains App Info
     * @returns Promise of AppInfo
     */
    async getAppInfo(): Promise<AppInfo> {
        return App.getInfo();
    }
}
