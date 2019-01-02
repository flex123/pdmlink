import { Component, OnInit } from '@angular/core';
import { ProductService} from './productService'
import { DomSanitizer} from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-product-tab',
  templateUrl: 'productTab.page.html',
  styleUrls: ['productTab.page.scss']
})
export class ProductTabPage implements OnInit{
  loading: any;
	products: any[] = [];
  parts: any[] = [];
  formattedParts: any[] = [];

	constructor(private productService: ProductService, private sanitizer: DomSanitizer, public loadingController: LoadingController) {
	}

	ngOnInit() {
	  this.productService.getProducts().subscribe(data => {
		  this.products = data['value'];
	  });
	}

	setProduct(event) {
    this.parts = [];
    this.formattedParts = [];
    this.presentLoading();

		this.productService.getParts(event.detail.value).subscribe(data => {
		  if (data['Folders'] && data['Folders'].length > 0) {
        const mainCabinet = data['Folders'][0];
			  if (mainCabinet['Contents'].length > 0) {
          mainCabinet['Contents'].forEach(content => {
            if (content.ID.startsWith('OR:wt.part.WTPart:')) {
              this.parts.push(content);
            }
          });
        }
        if (mainCabinet['Folders'].length > 0) {
          mainCabinet['Folders'].forEach(folder => {
            if (folder['Contents'] && folder['Contents'].length > 0) {
              folder['Contents'].forEach(content => {
                if (content.ID.startsWith('OR:wt.part.WTPart:')) {
                  this.parts.push(content);
                } 
              });
            }
          });
        }
			}
      if (this.parts.length > 0) {
        this.parts.forEach(part => {
          this.productService.getPart(part.ID).subscribe(data => {
            if (data.length > 0) {
              const formattedPart = data[0];
              let thumbnailURL = '';
              if(data[1]['value'].length > 0) {
                if (data[1]['value'][0]['TwoDThumbnailURL']) {
                  thumbnailURL = data[1]['value'][0]['TwoDThumbnailURL']['URL'];
                  const index = thumbnailURL.indexOf('/Windchill');
                  thumbnailURL = thumbnailURL.substring(index);
                  formattedPart['thumbnail'] = thumbnailURL;                
                }   
              }
              this.formattedParts.push(formattedPart);
              if (this.formattedParts.length === this.parts.length) {
                this.loading.dismiss();
              }
            }
          });
        });
      }

		});
	}

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 600000
    });
    return await this.loading.present();
  }
}
