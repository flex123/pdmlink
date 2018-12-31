import { Component, OnInit } from '@angular/core';
import { ProductService} from './productService'

@Component({
  selector: 'app-product-tab',
  templateUrl: 'productTab.page.html',
  styleUrls: ['productTab.page.scss']
})
export class ProductTabPage implements OnInit{
	products: any[] = [];
  parts: any[] = [];
	
	constructor(private productService: ProductService) {
	}

	ngOnInit() {
	  this.productService.getProducts().subscribe(data => {
		this.products = data['value'];
	  });
	}

	setProduct(event) {
    this.parts = [];
		this.productService.getParts(event.detail.value).subscribe(data => {
		  if (data['Folders'] && data['Folders'].length > 0) {
        const mainCabinet = data['Folders'][0];
			  if (mainCabinet['Contents'].length > 0) {
          mainCabinet['Contents'].forEach(content => {
            console.log(content);
            if (content.ID.startsWith('OR:wt.part.WTPart:')) {
              this.parts.push(content);
            }
          });
        }
        if (mainCabinet['Folders'].length > 0) {
          mainCabinet['Folders'].forEach(folder => {
            console.log(folder);
            if (folder['Contents'] && folder['Contents'].length > 0) {
              folder['Contents'].forEach(content => {
                if (content.ID.startsWith('OR:wt.part.WTPart:')) {
                  this.parts.push(content);
                } 
              });
            }
          });
        }
                  console.log(this.parts);

			}
		});
	}



}
