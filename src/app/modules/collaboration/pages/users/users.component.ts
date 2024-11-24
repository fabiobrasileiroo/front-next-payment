import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UsuarioService, Usuario } from 'src/app/core/services/usuario.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    SplitButtonModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  usuarios: Usuario[] = [];
  showDialog: boolean = false;
  editMode: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  globalFilter: string = '';
  usuarioAtual: Usuario = { name: '', email: '', password: '', role: 'USER' };

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  /**
   * Carrega todos os usuários da API.
   */
  carregarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe(
      (response) => {
        this.usuarios = response.users.map((user) => ({
          ...user,
          role: user.role || 'USER',
        }));
        this.isLoading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar usuários. Verifique sua conexão.',
        });
        console.error('Erro ao carregar usuários:', error);
        this.isLoading = false;
      }
    );
  }
   applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /**
   * Abre o diálogo para criar ou editar um usuário.
   * @param usuario Objeto do usuário para edição.
   */
  abrirDialogo(usuario?: Usuario): void {
    this.editMode = !!usuario;
    this.usuarioAtual = usuario
      ? { ...usuario, password: '' }
      : { name: '', email: '', password: '', role: 'USER' };
    this.showDialog = true;
  }

  /**
   * Salva um novo usuário ou atualiza um existente.
   */
  salvarUsuario(): void {
    if (!this.validarFormulario()) return;

    if (this.editMode) {
      this.atualizarUsuario();
    } else {
      this.criarUsuario();
    }
  }

  /**
   * Cria um novo usuário.
   */
  criarUsuario(): void {
    this.usuarioService.criarUsuario(this.usuarioAtual).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso!',
        });
        this.carregarUsuarios();
        this.showDialog = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar o usuário. Tente novamente mais tarde.',
        });
        console.error('Erro ao criar usuário:', error);
      }
    );
  }

  /**
   * Atualiza um usuário existente.
   */
  atualizarUsuario(): void {
    this.usuarioService.atualizarUsuario(this.usuarioAtual).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso!',
        });
        this.carregarUsuarios();
        this.showDialog = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar o usuário. Tente novamente mais tarde.',
        });
        console.error('Erro ao atualizar usuário:', error);
      }
    );
  }

  /**
   * Valida o formulário antes de salvar.
   * @returns boolean
   */
  validarFormulario(): boolean {
    if (!this.usuarioAtual.name || !this.usuarioAtual.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome e e-mail são obrigatórios!',
      });
      return false;
    }

    if (!this.editMode && !this.usuarioAtual.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A senha é obrigatória para novos usuários!',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioAtual.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'O e-mail inserido é inválido!',
      });
      return false;
    }

    if (!this.usuarioAtual.role || !['USER', 'ADMIN'].includes(this.usuarioAtual.role)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A role deve ser USER ou ADMIN.',
      });
      return false;
    }

    return true;
  }

  /**
   * Deleta um usuário pelo ID.
   * @param id ID do usuário a ser deletado.
   */
  deletarUsuario(id: number): void {
    this.usuarioService.deletarUsuario(id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário deletado com sucesso!',
        });
        this.carregarUsuarios();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar o usuário. Tente novamente mais tarde.',
        });
        console.error('Erro ao deletar usuário:', error);
      }
    );
  }
}
