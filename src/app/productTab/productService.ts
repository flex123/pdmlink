import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../authentication/authService';

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
}



