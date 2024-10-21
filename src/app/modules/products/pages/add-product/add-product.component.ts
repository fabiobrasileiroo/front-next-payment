import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductsHeaderComponent } from '../../components/products/products-header/products-header.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ProductsHeaderComponent],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  base64Image: string | null = null;

  constructor(private fb: FormBuilder, private productsService: ProductService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      nameCategory: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.pattern('https?://.+')]
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;

      // Pegar o companyId do localStorage
      const companyId = localStorage.getItem('companyId');
      if (companyId) {
        formData.companyId =parseInt(companyId); // Adicionar o companyId aos dados do formulário
        console.log(typeof formData.companyId)
      } else {
        console.error('Company ID not found in localStorage');
        return;
      }

      // Verificar se a imagem foi fornecida como Base64
      if (this.base64Image) {
        formData.imageUrl = this.base64Image; // Usar o Base64 como valor para imageUrl
        this.sendData(formData);
      } else if (formData.imageUrl) {
        // Se uma URL foi fornecida, usar diretamente
        this.sendData(formData);
      } else {
        console.error('No image provided');
        return;
      }
    }
  }

  private sendData(formData: any): void {
    // Remover o campo "image" do objeto formData, se existir
    delete formData.image;

    this.productsService.sendDataToApi(formData).subscribe(
      (response) => {
        console.log('Product created successfully:', response);
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }

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
