import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../authentication/authService';
import { Observable, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable(
{
   providedIn: 'root'
  }
)
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getProducts() {  
	  return this.http.get(this.authService.server + '/Windchill/servlet/odata/DataAdmin/Containers/PTC.DataAdmin.ProductContainer', this.authService.getRequestHeader(false));
  }

  getParts(id) {  
	  return this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Containers(\'' + id + '\')?$expand=Folders($expand=Folders($expand=Contents),Contents)', this.authService.getRequestHeader(false));
  }

  getThumbnail(partId) {
    return this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Parts(\'' + partId + '\')/Representations', this.authService.getRequestHeader(false));
  }
  /*
  getPart(partId) {

    return this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Parts(\'' + partId + '\')', this.authService.getRequestHeader(false)).pipe(
      mergeMap(data => return this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Parts(\'' + partId + '\')/Representations', this.authService.getRequestHeader(false)))
    );
  }*/

  getPart(partId) {
    const partQuery = this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Parts(\'' + partId + '\')', this.authService.getRequestHeader(false));
    const thumbnailQuery = this.http.get(this.authService.server + '/Windchill/servlet/odata/ProdMgmt/Parts(\'' + partId + '\')/Representations', this.authService.getRequestHeader(false));
    return zip(partQuery, thumbnailQuery);
  }

  getImage(imageURL: string): Observable<any> {
    return this.http.get(this.authService.server + imageURL, this.authService.getBlobRequestHeader());
  }
}



