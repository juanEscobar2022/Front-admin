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

import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

export interface PeriodicElement {
  currentm_user: string;
  date_move: string;
  type_move: string;
}

@Component({
  selector: "app-role",
  templateUrl: "./role.dialog.component.html",
  styleUrls: ["./role.dialog.component.css"],
})
export class RoleDialog {
  endpoint: string = "/rol";
  maskDNI = global.maskDNI;
  view: string = '';
  title: string = '';
  idRol: number;

  permissions: any;
  ValorRol: any = [];
  valoresList: any = [];
  //loading: boolean = false;
  component = "/admin/roles";
  dataSource: any = [];
  RolInfo: any = [];
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
    public dialogRef: MatDialogRef<RoleDialog>,
    private WebApiService: WebApiService,
    private handler: HandlerAppService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog
  ) {
    this.view = this.data.window;
    this.idRol = 0;

    switch (this.view) {
      case "create":
        this.initFormsRole();
        this.title = "Crear Nuevo Rol";
        break;
      case "update":
        this.initFormsRole();
        this.title = "Editar Rol";
        this.idRol = this.data.codigo;
        break;
      case "view":
        this.idRol = this.data.codigo;
        this.title = "Información detallada";
        this.cuser = JSON.parse(this.cuser);
        this.loading.emit(true);
        this.WebApiService.getRequest(this.endpoint + "/" + this.idRol, {
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
    this.getDataInit();
    this.formCreate = new FormGroup({
      name: new FormControl(""),
      status: new FormControl(""),
      createdBy: new FormControl(this.cuser.iduser),
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
          this.RolInfo = data.data["getDataRole"];

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
      idRol: this.idRol,
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
    }).subscribe(
      (data) => {
        if (data.success) {
          this.formCreate
            .get("name")
            .setValue(data.data["getSelecUpdat"][0].name);
          this.formCreate
            .get("status")
            .setValue(data.data["getSelecUpdat"][0].status);
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
      this.WebApiService.putRequest(this.endpoint + "/" + this.idRol, body, {
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
