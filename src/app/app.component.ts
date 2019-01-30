import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthUser } from '../providers/entities/entities';
import { AuthProvider } from '../providers/auth/auth'
import { environment } from '../environment';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'RegisterPage';
  firebaseConfig: any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public User: AuthUser, public authService: AuthProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [ 
    {
      title: 'Home',
      component: 'HomePage'
    },{
      title: 'List',
      component: 'UserlistPage'
    }
    ];
  }

  initializeApp() { 
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      console.log(this.User, 'user exact value after refresh');

      this.authService.ensureAuthenticate().then(user=>{
        if (user && user.uid) {
          Object.assign(this.User, user);        
        }
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.authService.logout(); 
  }
}
