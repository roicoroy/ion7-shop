import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { fadeOutAnimation, flipAnimation, slideAnimation } from '../../animations/nav-animation';
export interface IInternalNavigationOptions {
    /** The soft URL to navigate to. */
    url: string;
    /** Additional queryParams. */
    queryParams?: any;
    /** If true apply slide up flow animation. */
    flowAnimation?: boolean;
    /**
     * Optional list of forward paths. If specified, after navigating to url will navigate forward through this list.
     * Used to handle back navigation flow.
     */
    forwardPaths?: string[];
}
@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    constructor(
        private navCtrl: NavController,
        private router: Router
    ) { }
    async navigateForward(url: string, direction: any = 'forward') {
        await this.navCtrl.navigateForward(url, {
            animation: slideAnimation,
            animated: true,
            animationDirection: direction
        });
    }
    async navigateForwardParams(url: string, params?: any, direction: any = 'forward') {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                // params: JSON.stringify(params),
                params
            }
        };
        await this.navCtrl.navigateForward(url, {
            queryParams: navigationExtras,
            animation: slideAnimation,
            animated: true,
            animationDirection: direction
        });
    }
    async navigateFlip(url: string) {
        await this.navCtrl.navigateForward(url, {
            animation: flipAnimation,
            animated: true,
        });
    }
    async navControllerDefault(url: string, direction: any = 'forward') {
        await this.router.navigateByUrl(url, { });
    }
}
