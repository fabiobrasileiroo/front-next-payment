import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { UnidadeService } from 'src/app/core/services/unidade.service';


@Component({
  selector: 'app-company-unit',
  standalone: true,
  imports: [NgFor],
  templateUrl: './company-unit.component.html',
  styleUrl: './company-unit.component.scss'
})
export class CompanyUnitComponent {
unidades: any[] = [];

  constructor(private unidadeService: UnidadeService) {}

  ngOnInit(): void {
    this.carregarUnidades();
  }

  carregarUnidades(): void {
    this.unidadeService.getUnidades().subscribe(
      (response) => {
        this.unidades = response.units;
      },
      (error) => {
        console.error('Erro ao carregar unidades:', error);
      }
    );
  }

  criarUnidade(): void {
    const novaUnidade = { name: 'Unidade Nova' };
    this.unidadeService.criarUnidade(novaUnidade).subscribe(
      (response) => {
        console.log('Unidade criada com sucesso:', response);
        this.carregarUnidades();
      },
      (error) => {
        console.error('Erro ao criar unidade:', error);
      }
    );
  }

  atualizarUnidade(id: number): void {
    const unidadeAtualizada = { name: 'Unidade Atualizada', pixKey: 'novaPixKey' };
    this.unidadeService.atualizarUnidade(id, unidadeAtualizada).subscribe(
      (response) => {
        console.log('Unidade atualizada com sucesso:', response);
        this.carregarUnidades();
      },
      (error) => {
        console.error('Erro ao atualizar unidade:', error);
      }
    );
  }

  deletarUnidade(id: number): void {
    this.unidadeService.deletarUnidade(id).subscribe(
      (response) => {
        console.log('Unidade deletada com sucesso:', response);
        this.carregarUnidades();
      },
      (error) => {
        console.error('Erro ao deletar unidade:', error);
      }
    );
  }
}
