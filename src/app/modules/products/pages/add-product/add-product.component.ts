import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductsHeaderComponent } from '../../components/products/products-header/products-header.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { SkeletonModule } from 'primeng/skeleton';

import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ContextMenuModule } from 'primeng/contextmenu';

// import { Product } from '@domain/product';
// import { ProductService } from '@service/productservice';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';

// Interfaces para tipagem do JSON atualizado
export interface Company {
  id: number;
  name: string;
  document: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  companyId: number;
  quantity: number;
  categoryId?: number;
  company?: Company;
  category?: Category;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProductsHeaderComponent, ToastModule, ButtonModule, RippleModule, ButtonComponent, SkeletonModule, InputTextareaModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
    ToastModule,
    TooltipModule,
    ContextMenuModule,
    FileUploadModule,
    ConfirmDialogModule,
    SelectModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    FormsModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    DialogModule,
    FormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [ConfirmationService, MessageService],
})

export class AddProductComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  // table itens 
  productDialog: boolean = false;
  products: Product[] = [];
  product: Product | null = null;
  selectedProducts: Product[] | null = null;
  submitted: boolean = false;
  categories: { label: string; value: number }[] = []; // Para o dropdown de categorias
  newCategoryName: string | null = null; // Track new category name if added

  // add products
  productForm!: FormGroup;
  base64Image: string | null = null;
  imageUrl: string | null = null;
  isLoading: boolean = true; // Controla o skeleton loader
  loading: boolean = false; // Controla o botão de carregamento
  statuses: any// { label: string; value: string; }[];
  submitChange: string = '';
  // productServiceMock: { id: string; code: string; name: string; description: string; image: string; price: number; category: string; quantity: number; inventoryStatus: string; rating: number; };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // this.productForm = this.fb.group({
    //   name: ['', Validators.required],
    //   price: [0, [Validators.required, Validators.min(0.01)]],
    //   description: [''],
    //   nameCategory: ['', Validators.required],
    //   quantity: [0, [Validators.required, Validators.min(1)]],
    //   imageUrl: ['', Validators.pattern('https?://.+')]
    // });
    this.initializeForm()
    // Simular carregamento de produtos e categorias
    // this.products = this.fetchProducts();
    // this.categories = this.fetchCategories();
    // Carregar produtos e categorias
    this.loadProducts();


    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

  }
  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1.00)]],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['']
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Carregar produtos a partir do ProductService
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        console.log("🚀 ~ AddProductComponent ~ loadProducts ~ products:", data);
        this.isLoading = false
        // Extraindo categorias exclusivas para o dropdown
        this.categories = this.extractUniqueCategories(data);
      },
      (error) => {
        this.isLoading = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading products', life: 3000 });
        console.error('Error loading products:', error);
      }
    );
  }
  // Extrair categorias únicas do array de produtos
  // private extractUniqueCategories(products: Product[]): { label: string; value: number }[] {
  //   const uniqueCategories: { label: string; value: number }[] = [];

  //   products.forEach((product) => {
  //     if (product.category && !uniqueCategories.some(c => c.value === product.category!.id)) {
  //       uniqueCategories.push({ label: product.category.name, value: product.category.id });
  //     }
  //   });

  //   return uniqueCategories;
  // }
  private extractUniqueCategories(products: Product[]): { label: string; value: number }[] {
    const uniqueCategories: { label: string; value: number }[] = [];
    products.forEach((product) => {
      if (product.category && !uniqueCategories.some(c => c.value === product.category!.id)) {
        uniqueCategories.push({ label: product.category.name, value: product.category.id });
      }
    });
    return uniqueCategories;
  }
  initializeProduct(): Product {
    return {
      id: 0,
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      companyId: 0,
      quantity: 0,
      categoryId: undefined
    };
  }
  openNew(): void {
    this.resetForm();
    this.submitChange = 'create'
    this.productDialog = true;
    this.product = this.initializeProduct(); // Indica que é um novo produto
    this.submitted = false
  }

  editProduct(product: Product): void {
    this.submitChange = 'edit'
    this.product = { ...product }; // Clona o produto selecionado para edição
    this.productForm.patchValue({
      ...product,
      imageUrl: product.imageUrl || ''
    });
    this.base64Image = null; // Limpa base64 caso venha de um arquivo anterior
    this.imageUrl = product.imageUrl || null;
    this.productDialog = true;
    this.submitted = false;
  }

  private resetForm(): void {
    this.productForm.reset();
    this.base64Image = null;
    this.imageUrl = null;
    this.isLoading = false;
    this.submitChange = ''
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('passou aqui', this.productForm.invalid)
    console.log('passou aqui', this.productForm)
    // if (this.productForm.invalid) return;
    console.log('passou aqui')
    this.isLoading = true;
    const formData = { ...this.productForm.value };

    const companyId = localStorage.getItem('companyId');
    if (companyId) {
      formData.companyId = parseInt(companyId);
    } else {
      this.showError('Company ID not found in localStorage');
      return;
    }

    formData.imageUrl = this.base64Image || this.imageUrl || '';
    console.log('antes de chegar na condicao')
    if (this.submitChange === 'edit') {
      console.log('update', formData)
      this.updateProduct(formData);
    } else if (this.submitChange === 'create') {
      console.log('create', formData)
      this.createProduct(formData);
    }
  }

  saveProduct() {
    this.submitted = true;
    const product: any = this.product;
    console.log("🚀 ~ AddProductComponent ~ saveProduct ~ product:", product)

    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
    });

    console.log(this.product?.name?.trim())
    if (this.product?.name?.trim()) {
      console.log('entrou aqui')
      if (this.product.id) {
        // Atualizar produto existente
        console.log('entrou aqui')
        this.onSubmit()
        // this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado', styleClass:"!bg-card !border-border !text-foreground", life: 3000 });
      } else {
        console.log('entrou aqui')
        // Criar novo produto
        // this.product.id = this.createId();
        this.onSubmit()
        // this.products.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado', styleClass:"!bg-card !border-border !text-foreground", life: 3000 });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {} as Product;
    }
  }

  private createProduct(formData: any): void {
    console.log(formData)
    this.productService.createProducts(formData).subscribe(
      (response) => {
        this.products.push(response);
        this.showSuccess('Product created successfully');
        this.closeDialog();
      },
      (error) => {
        this.showError('Error creating product');
        console.error('Error:', error);
      }
    );
  }
  checkForNewCategory(event: any): void {
    const typedValue = event.target.value;
    const existingCategory = this.categories.find(cat => cat.label === typedValue);
    if (!existingCategory) {
      this.newCategoryName = typedValue;
    } else {
      this.newCategoryName = null;
      this.product!.categoryId = existingCategory.value as number;
    }
  }

  private updateProduct(formData: any): void {
    if (!this.product) return;

    formData.id = this.product.id; // Inclui o ID do produto a ser atualizado
    this.productService.updateProducts(formData).subscribe(
      (response) => {
        console.log(response)
        // this.products.push(response);
        const index = this.products.findIndex(p => p.id === formData.id);
        if (index !== -1) this.products[index] = response;
        this.showSuccess('Product updated successfully');
        this.closeDialog();
      },
      (error) => {
        this.showError('Error updating product');
        console.error('Error:', error);
      }
    );
  }

  private closeDialog(): void {
    this.productDialog = false;
    this.resetForm();
    this.submitted = false;
    this.isLoading = false;
  }

  //   openNew(): void {
  //   this.productDialog = true;
  //   this.submitted = false;
  //   this.productForm.reset();
  //   this.base64Image = null;
  //   this.imageUrl = null;
  // }
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids: any = this.selectedProducts?.map(product => product.id);
        console.log("🚀 ~ AddProductComponent ~ deleteSelectedProducts ~ ids:", ids)

        this.productService.deleteProductsMult(ids).subscribe({
          next: () => {
            // Remove os produtos da lista local
            this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
            this.selectedProducts = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', styleClass:"!bg-card !border-border !text-foreground", life: 3000 });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, styleClass:"!bg-card !border-border !text-foreground", life: 3000 });
          }
        });
      }
    });
  }


  // deleteSelectedProducts() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected products?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
  //       this.selectedProducts = null;
  //       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  //     }
  //   });
  // }

  // editProduct(product: Product) {
  //   this.product = { ...product };
  //   this.productDialog = true;
  // }
  //  editProduct(product: Product): void {
  //   this.product = { ...product }; // Clona o produto selecionado para edição
  //   this.productForm.patchValue({
  //     ...product,
  //     imageUrl: product.imageUrl || '' // Preenche a URL da imagem, se houver
  //   });
  //   this.base64Image = null; // Limpa o campo base64 se houver
  //   this.imageUrl = product.imageUrl || null; // Preenche com a URL original
  //   this.productDialog = true;
  //   this.submitted = false;
  // }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products = this.products.filter((val) => val.id !== product.id);
        this.productService.deleteProducts(product).subscribe(
          (response) => {
            console.log("🚀 ~ AddProductComponent ~ deleteProduct ~ response:", response)
            this.products = this.products.filter((p) => p.id !== product.id);
            this.showSuccess('Product created successfully');
            this.closeDialog();
          },
          (error) => {
            this.showError('Error creating product');
            console.error('Error:', error);
          }
        );
        // this.product = {} as Product;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', styleClass:"!bg-card !border-border !text-foreground", life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }


  findIndexById(id: number): number {
    return this.products.findIndex(product => product.id === id);
  }

  createId(): number {
    return Math.floor(Math.random() * 10000);
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  // onSubmit(): void {
  //   this.submitted = true;
  //   if (this.productForm.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.loading = true;
  //   const formData = this.productForm.value;

  //   // Adiciona companyId a partir do localStorage
  //   const companyId = localStorage.getItem('companyId');
  //   if (companyId) {
  //     formData.companyId = parseInt(companyId);
  //   } else {
  //     this.showError('Company ID not found in localStorage');
  //     return;
  //   }

  //   // Configura a imagem a partir de base64 ou URL
  //   formData.imageUrl = this.base64Image || this.imageUrl || '';

  //   // Enviar os dados do produto
  //   this.sendData(formData);
  // }

  private sendData(formData: any): void {
    this.productService.createProducts(formData).subscribe(
      (response) => {
        this.resetLoading();
        this.showSuccess('Product created successfully');
        this.productDialog = false;
        this.productForm.reset();
      },
      (error) => {
        this.resetLoading();
        this.showError('Error creating product');
        console.error('Error creating product:', error);
      }
    );
  }

  private resetLoading(): void {
    this.isLoading = false;
    this.loading = false;
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
       styleClass:"!bg-card !border-border !text-foreground",
      detail: message
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
       styleClass:"!bg-card !border-border !text-foreground",
      detail: message
    });
  }

  // Lida com o upload de arquivo local e converte para base64
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string; // Armazena a imagem como base64
        this.imageUrl = null; // Limpa o campo de URL se houver
      };
      reader.readAsDataURL(file);
    }
  }

  // Lida com a entrada de URL da imagem e tenta convertê-la para base64
  onImageUrlEntered(): void {
    if (this.imageUrl) {
      this.convertImageUrlToBase64(this.imageUrl).then((base64) => {
        this.base64Image = base64;
        this.productForm.patchValue({ imageUrl: base64 });
      }).catch(() => {
        this.showError('Invalid image URL');
      });
    }
  }

  updateQuantity(product: Product, newQuantity: number) {
    console.log("🚀 ~ AddProductComponent ~ updateQuantity ~ newQuantity:", newQuantity)
    if (newQuantity < 0) return; // Impede quantidades negativas

    const quantityDifference = newQuantity - product.quantity;
    console.log("🚀 ~ AddProductComponent ~ updateQuantity ~ quantityDifference:", quantityDifference)

    // Atualiza visualmente a quantidade antes de confirmar com a API
    product.quantity = newQuantity;
    console.log("🚀 ~ AddProductComponent ~ updateQuantity ~ quantity:", product.quantity)

    // Chama a API para atualizar a quantidade com a URL adequada
    console.log('antes de ir', quantityDifference)
    this.productService.updateProductQuantity(product.id, quantityDifference)
      .subscribe({
        next: () => console.log('Quantidade atualizada com sucesso'),
        error: (err: Error) => {
          console.error('Erro ao atualizar quantidade:', err);
          // Reverte visualmente a quantidade se ocorrer um erro
          product.quantity -= quantityDifference;
        }
      });
  }

  submitQuantityChange(product: any ) {
  const newQuantity = product.quantityInput;

  // Calcula a diferença
  const quantityDifference = newQuantity - product.quantity;

  // Se não houver diferença, não envia a requisição
  if (quantityDifference === 0) return;

  // Atualiza visualmente e chama a API
  this.updateQuantity(product, newQuantity);
}

  // Função para converter URL da imagem em base64
  private convertImageUrlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = (error) => reject(error);
      xhr.send();
    });
  }
}
