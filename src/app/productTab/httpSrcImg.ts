import {Component, ElementRef, Input} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../authentication/authService';
import { Observable } from 'rxjs';
import { DomSanitizer} from '@angular/platform-browser';


@Component({
    selector: 'http-img-src',
    template: "<img [src]=\"imgURL || ''\">"
})


export class HttpSrcImg {
  @Input() src: string;
  imgURL: any;

  constructor(private authService: AuthService, private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

    if (this.src) {
      this.getImage(this.src).subscribe(data => {
        this.imgURL = this.createImageFromBlob(data);
      });
    }else {
      this.imgURL = 'assets/img/blank.png';
    }
  }

  getImage(imageURL: string): Observable<any> {
    return this.http.get(imageURL, this.authService.getBlobRequestHeader());
  }

  createImageFromBlob(image: any) {
    const blob = new Blob([image]);
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }
}
