import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
   providedIn: 'root'
  }
)
export class AuthService {
  isLoggedin: boolean;
  headers: HttpHeaders;
  server: string;
  nonceKey: string;
  nonce: string;
  creds: string;

  constructor(private http: HttpClient, public storage: Storage) {
    console.log('new AuthService');
    this.http = http;
    this.isLoggedin = false;
    this.headers = new HttpHeaders();
    this.server = '';
    this.nonceKey = '';
    this.nonce = '';
    this.creds = '';
    storage.get('cachedUserInfo').then((data)=>{
      if(!data){
        storage.set('cachedUserInfo', JSON.stringify([]));
      }
    });
  }

  storeUserCredentials(nonceData, cred) {

  }


  loadUserNonce(headers) {
    headers.append(this.nonceKey, this.nonce);
  }

  destroyUserCredentials() {
  }

  authenticate(user) {
    let creds = 'Basic ' + this.encode(user.name + ':' + user.password);
	const httpOptions = {
	  headers: new HttpHeaders({
		'Authorization': creds
	    })
    };
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.get(user.server + '/Windchill/servlet/odata/PTC/GetCSRFToken()', httpOptions).subscribe(data => {
        const nonceData: any = data;
        this.server = user.server;
		console.log(creds);
        this.creds = creds;
		console.log(nonceData);
        this.nonceKey = nonceData.NonceKey;
        this.nonce = nonceData.NonceValue;
        this.isLoggedin = true;
        this.cacheUser(user.name);
        resolve(200);
      }, error => {
        resolve(error.status);
      });
    });
  }

  getRequestHeader(includeNonce) {
  	let httpOptions = {
	  headers: new HttpHeaders({
		'Authorization': this.creds
	    })
    };

	  if (includeNonce) {
	    const nonceKey = this.nonceKey;
	    httpOptions = {
	        headers: new HttpHeaders({
		      'Authorization': this.creds,
		      nonceKey: this.nonce
		    })
	    };
	  }
    return httpOptions;
  }

  getBlobRequestHeader() {
  	let httpOptions = {
	    headers: new HttpHeaders({
		  'Authorization': this.creds
	    }),
      //observe: 'response' as 'body',
      responseType: 'arraybuffer' as 'json'
      
    };

    return httpOptions;
  }

  cacheUser(username){
    this.storage.get("cachedUserInfo").then((cachedUserInfo)=>{
      let profiles = JSON.parse(cachedUserInfo);
      let userExists = false;

      profiles.forEach((profile)=>{
        if(profile.server === this.server){
          profile.username = username;
          userExists = true;
        }
      });
      if(!userExists){
        let newProfile = {};
        newProfile['server'] = this.server;
        newProfile['username'] = username;
        profiles.push(newProfile);
      }

      this.storage.set("cachedUserInfo", JSON.stringify(profiles));
    });
  }

  getCachedProfiles(){
    return this.storage.get("cachedUserInfo");
  }

  logout() {
    this.destroyUserCredentials();
  }

  encode(input) {
    const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
  }
}


