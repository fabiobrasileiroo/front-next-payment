import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UnidadeService } from 'src/app/core/services/unidade.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-company-unit',
  standalone: true,
  imports: [NgFor, NgIf, TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule],
  providers: [MessageService],
  templateUrl: './company-unit.component.html',
  styleUrls: ['./company-unit.component.scss'],
})
export class CompanyUnitComponent implements OnInit {
  unidades: any[] = [];
  showDialog: boolean = false;
  globalFilter: string = '';
  unidadeAtual: any = { name: '', pixKey: '' };

  constructor(private unidadeService: UnidadeService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.carregarUnidades();
  }

  carregarUnidades(): void {
    this.unidadeService.getUnidades().subscribe(
      (response) => {
        this.unidades = response.units;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar unidades. Verifique sua conexão.',
        });
      }
    );
  }

  abrirDialogo(unidade?: any): void {
    this.unidadeAtual = unidade ? { ...unidade } : { name: '', pixKey: '' };
    this.showDialog = true;
  }

  salvarUnidade(): void {
    if (!this.unidadeAtual.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O nome é obrigatório!',
      });
      return;
    }

    if (this.unidadeAtual.id) {
      this.atualizarUnidade(this.unidadeAtual.id);
    } else {
      this.criarUnidade();
    }
  }

  criarUnidade(): void {
    console.log(this.unidadeAtual)
    this.unidadeService.criarUnidade(this.unidadeAtual).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Unidade criada com sucesso!',
        });
        this.carregarUnidades();
        this.showDialog = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar unidade.',
        });
      }
    );
  }

  atualizarUnidade(id: number): void {
    this.unidadeService.atualizarUnidade(id, this.unidadeAtual).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Unidade atualizada com sucesso!',
        });
        this.carregarUnidades();
        this.showDialog = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar unidade.',
        });
      }
    );
  }

  deletarUnidade(id: number): void {
    this.unidadeService.deletarUnidade(id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Unidade deletada com sucesso!',
        });
        this.carregarUnidades();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar unidade.',
        });
      }
    );
  }
}
