// import {Inject, Inject} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  Component,
  Inject,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { WebApiService } from "../../services/web-api.service";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { HandlerAppService } from "../../services/handler-app.service";
import { environment } from "../../../environments/environment";
import { global } from "../../services/global";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-category.dialog',
  templateUrl: './category.dialog.component.html',
  styleUrls: ['./category.dialog.component.css']
})
export class CategoryDialog {

  endpoint: string = '/category';
  maskDNI = global.maskDNI;
  view: string = '';
  title: string = '';
  idCat: number;

  permissions: any;
  ValorRol: any = [];
  valoresList: any = [];
  //loading: boolean = false;
  component = "/customer/category";
  dataSource: any = [];
  CategoryInfo: any = [];
  // formLista: FormGroup | undefined;

  role: any = [];
  formRole: FormGroup | undefined;
  formCreate:any = FormGroup;
  // formUpdate: FormGroup;

  // public cuser: any = JSON.parse(localStorage.getItem("currentUser"));
  public cuser: any = localStorage.getItem("myStoredUser");
  // public cuser: any  = 

  //OUTPUTS
  @Output() loading = new EventEmitter();
  @Output() reload = new EventEmitter();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  historyMon: any = [];
  displayedColumns: any = [];

  // public clickedRows;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialog>,
    private WebApiService: WebApiService,
    private handler: HandlerAppService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog
  ) {
    this.view = this.data.window;
    this.idCat = 0;

    switch (this.view) {
      case "create":
        this.initFormsRole();
        this.title = "Ingresar Categoria de Musica";
        break;
      case "update":
        this.initFormsRole();
        this.title = "Editar Categoria";
        this.idCat = this.data.codigo;
        break;
      case "view":
        this.idCat = this.data.codigo;
        this.title = "Información detallada";
        this.cuser = JSON.parse(this.cuser);
        this.loading.emit(true);
        this.WebApiService.getRequest(this.endpoint + "/" + this.idCat, {
          token: this.cuser.token,
          id: this.cuser.id,
          modulo: this.component,
        }).subscribe(
          (data) => {
            if (data.success == true) {
              this.role = data.data[0];
              this.loading.emit(false);
            } else {
              this.handler.handlerError(data);
              this.closeDialog();
              this.loading.emit(false);
            }
          },
          (error) => {
            this.handler.showError("Se produjo un error");
            this.loading.emit(false);
          }
        );
        break;
    }
  }
  initFormsRole() {
    // this.cuser = JSON.parse(this.cuser);

    this.getDataInit();
    this.formCreate = new FormGroup({
      id_list: new FormControl(""),
      create_User: new FormControl(this.cuser.iduser),
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.permissions = this.handler.permissionsApp;
    this.sendRequest();
  }
  sendRequest() {}

  getDataInit() {
    this.loading.emit(false);
    this.cuser = JSON.parse(this.cuser);
    this.WebApiService.getRequest(this.endpoint, {
      action: "getParamsUpdate",
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
    }).subscribe(
      (data) => {
        if (data.success == true) {
          //DataInfo
          this.CategoryInfo = data.data["getCategory"];

          if (this.view == "update") {
            this.getDataUpdate();
          }
          this.loading.emit(false);
        } else {
          this.handler.handlerError(data);
          this.loading.emit(false);
        }
      },
      (error) => {
        this.handler.showError("Se produjo un error");
        this.loading.emit(false);
      }
    );
  }

  getDataUpdate() {
    this.loading.emit(true);
    this.WebApiService.getRequest(this.endpoint, {
      action: "getParamsUpdateSub",
      idCat: this.idCat,
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
    }).subscribe(
      (data) => {
        if (data.success) {
          this.formCreate
            .get("id_list")
            .setValue(data.data["getSelecUpdat"][0].id_list);
          
          this.loading.emit(false);
        } else {
          this.handler.handlerError(data);
          this.loading.emit(false);
          this.closeDialog();
        }
      },
      (error) => {
        this.handler.showError();
        this.loading.emit(false);
      }
    );
  }

  onSubmitUpdate() {
    if (this.formCreate.valid) {
      let body = {
        listas: this.formCreate.value,
      };
      this.loading.emit(true);
      this.WebApiService.putRequest(this.endpoint + "/" + this.idCat, body, {
        token: this.cuser.token,
        id: this.cuser.id,
        modulo: this.component,
      }).subscribe(
        (data) => {
          if (data.success) {
            this.handler.showSuccess(data.message);
            this.reload.emit();
            this.closeDialog();
          } else {
            this.handler.handlerError(data);
            this.loading.emit(false);
          }
        },
        (error) => {
          this.handler.showError();
          this.loading.emit(false);
        }
      );
    } else {
      this.handler.showError("Complete la información necesaria");
    }
  }

  onSubmi() {
    if (this.formCreate.valid) {
      this.loading.emit(true);
      let body = {
        listas: this.formCreate.value,
      };
      this.WebApiService.postRequest(this.endpoint, body, {
        token: this.cuser.token,
        id: this.cuser.id,
        modulo: this.component,
      }).subscribe(
        (data) => {
          if (data.success) {
            this.handler.showSuccess(data.message);
            this.reload.emit();
            this.closeDialog();
          } else {
            this.handler.handlerError(data);
            this.loading.emit(false);
          }
        },
        (error) => {
          this.handler.showError();
          this.loading.emit(false);
        }
      );
    } else {
      this.handler.showError("Complete la informacion necesaria");
      this.loading.emit(false);
    }
  }

}
