import { Component } from '@angular/core';
import {AuthService} from './authService';
import {NavController, LoadingController, NavParams} from '@ionic/angular';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: 'authentication.page.html',
  styleUrls: ['authentication.page.scss']
})
export class AuthenticationPage {
	usercreds: any;
	cachedProfiles: Array<any>;
	constructor(public loadingCtrl: LoadingController, private authservice: AuthService, private router: Router) {
		this.usercreds = {
			server: '',
			name: '',
			password: ''
		};

		this.authservice.getCachedProfiles().then((cachedUserInfo)=>{
		  let profiles = JSON.parse(cachedUserInfo);
		  this.cachedProfiles = profiles;
		});
	}

    signIn(user) {
    if(this.usercreds.server.length === 0 || this.usercreds.name.length === 0 || this.usercreds.password.length === 0) {
       // this.presentErrorMessage('Server, User and Password are required fields.');
    }else{
      //this.presentLoading();
      this.authservice.authenticate(user).then(data => {
        if(data === 200) {
			this.router.navigate(['/tabs']);
			/*
			  if(this.navParams.get("objectId")){
				this.navcontroller.setRoot(HomePage, {objectId: this.navParams.get("objectId")});
			  }else{
				this.navcontroller.setRoot(HomePage);
			  }
			  */
			}else{
			   // this.presentErrorMessage('Error detected. Please try again.');
			}
      });
    }
  }

}
