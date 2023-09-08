import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  search: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private confirmService: ConfirmDialogService,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll(this.search)
    .pipe(take(1))
    .subscribe(products => {
      this.products = products;
    });
  }

  onSeed() {
    this.productService.seed()
    .pipe(take(1)).subscribe(() => {
      this.loadProducts();
    })
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(id: string) {
    const queryParams = { action: 'edit' };
    this.router.navigate([id], { relativeTo: this.route, queryParams });
  }

  onDetails(id: string) {
    const queryParams = { action: 'view' };
    this.router.navigate([id], { relativeTo: this.route, queryParams });
  }

  onDelete(id: string) {
    const message = 'Está seguro que desea eliminar el producto?';
    this.confirmService.openConfirm(message)
    .pipe(take(1)).subscribe(ok => {
      if (ok) this.productService.delete(id)
        .pipe(take(1)).subscribe(() => {
          this.loadProducts();
        });
    });
  }

}
