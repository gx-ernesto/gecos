import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

type SaveAction = keyof Pick<ProductService, 'create' | 'update'>;
const validationErrors: { [key: string]: string } = {
  required: 'El campo {name} es requerido.',
  minlength: 'La longitud mínima del campo {name} es {length}.',
  maxlength: 'La longitud máxima del campo {name} es {length}.',
};

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isNew: boolean = false;
  isEdit: boolean = false;
  get title() { return this.isNew ? 'Alta' : this.isEdit ? 'Editar' : 'Artículo' };
  get showSave() { return this.isNew || this.isEdit };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.isNew = this.route.snapshot.url[0]?.path === 'new';

    if (!this.isNew) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEdit = this.route.snapshot.queryParamMap.get('action') === 'edit';
        this.productService.getById(id)
        .pipe(take(1)).subscribe(product => {
          this.initValues(product);
        });
      }
    }

    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      code: [
        { value: '', disabled: !(this.isNew || this.isEdit) },
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)]
      ],
      name: [
        { value: '', disabled: !(this.isNew || this.isEdit) },
        [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      ],
    });
  }

  initValues(product: Product) {
    this.form.get('id')?.setValue(product.id);
    this.form.get('code')?.setValue(product.code);
    this.form.get('name')?.setValue(product.name);
  }

  getErrors(id: string, name: string): string[] {
    const errors = Object.entries(this.form.get(id)?.errors ?? {});
    return errors.map(([error, value]) => {
      let message = validationErrors[error];
      message = message.replace('{name}', name);
      if (value?.requiredLength)
        message = message.replace('{length}', value.requiredLength);
      return message;
    });
  }

  onGoToList() {
    this.router.navigate(['product']);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const data: Product = this.form.getRawValue();
    const action: SaveAction = this.isNew ? 'create' : 'update';
    this.productService[action](data)
    .pipe(take(1)).subscribe(() => {
      this.onGoToList();
    });
  }

}
