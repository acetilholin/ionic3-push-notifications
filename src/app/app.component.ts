import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { HttpClient} from "@angular/common/http";

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private push: Push, private http: HttpClient ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pushSetup();
      this.push.hasPermission()   /* TODO: for testing purposes, remove it after */
          .then((res: any) => {
            if (res.isEnabled) {
              console.log('We have permission to send push notifications');
            } else {
              console.log('We do not have permission to send push notifications');
            }
          });
    });
  }

  pushSetup() {

    const options: PushOptions = {
      android: {
        senderID: '506366808708'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    let pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) =>
         /* console.log('Device registered', registration)*/
        this.http.post('http://share.dev.local/debug/index/push',
            { 'token':registration,
                    'title': 'test',
                    'body': 'hello world'
            }).subscribe( data => {
              console.log(data['body']);
        })
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}

