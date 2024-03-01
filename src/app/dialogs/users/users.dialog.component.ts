import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import {Inject, Component,  Output,  EventEmitter,  OnInit} from '@angular/core';
import { WebApiService } from "../../services/web-api.service";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  ValidationErrors,
  FormControlName,
} from "@angular/forms";
import { environment } from "../../../environments/environment";
import { HandlerAppService } from "../../services/handler-app.service";
import { global } from "../../services/global";
import { DatePipe } from '@angular/common';

interface Login {
  sesion: number;
  viewValue: string;
}

@Component({
  selector: "users-dialog",
  templateUrl: "users.dialog.component.html",
  styleUrls: ["./user.dialog.component.css"],
})
export class UsersDialog {
  // VARIABLES
  view: string;
  usuario: any = [];
  title: string = '';
  id: number;
  user: any = [];
  ape: any = [];
  permissions: any;
  typeStatus: any = [];
  typeMatriz: any = [];
  typeCampaign: any = [];
  typeRol: any = [];
  typeRolAsesor: any = [];
  person: any = [];
  rol: any = [];
  statusLid: any = [];
  superviso: any = [];
  city: any = [];
  // name: any =[];
  touched: any = [];
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl("", [Validators.required]);
  // surname = new FormControl("", [Validators.required]);
  // username = new FormControl("", [Validators.required]);
  status = new FormControl("", [Validators.required]);
  role = new FormControl("", [Validators.required]);
  // matrizarp = new FormControl("", [Validators.required]);
  // campana = new FormControl("", [Validators.required]);
  // registro a consultar.
  endpoint: string = "/usuario";
  maskDNI = global.maskDNI;
  component = "/admin/users";
  // FORMULARIOS
  formUsuario:any = FormGroup;
  value = "";
  value2 = "";
  value3 = "";
  act: any = [];
  sesion: number =0;
  exitsPersonal: any = [];
  check_mens: boolean = false;

  log: any = [];
  // sesion: any = [];
  // interface Food {
  //     value: string;
  //     viewValue: string;
  //   }
  login: Login[] = [
    { sesion: 0, viewValue: "OFF" },
    { sesion: 1, viewValue: "ON" },
  ];
  public cuser: any = localStorage.getItem("myStoredUser");
  // // OUTPUTS
  @Output() loading = new EventEmitter();
  @Output() reload = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<UsersDialog>,
    private WebApiService: WebApiService,
    private handler: HandlerAppService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.cuser = JSON.parse(this.cuser);
    this.view = this.data.window;
    this.rol = this.cuser.role;
    this.id = 0;
    switch (this.view) {
      case "view":
      //  this.cuser = JSON.parse(this.cuser);

        this.id = this.data.codigo;
        this.loading.emit(true);
        this.WebApiService.getRequest(this.endpoint + "/" + this.id, {
          token: this.cuser.token,
          id: this.cuser.id,
          modulo: this.component,
        }).subscribe(
          (data) => {
            if (data.success == true) {
              this.usuario = data.data[0];
              this.act = this.usuario.login;
              if (this.act == "1") {
                this.log = "ON";
              } else if (this.act == "0" || this.act == null) {
                this.log = "OFF";
              }

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
      case "create":
        this.initForms();
        this.title = "Crear Usuario ";
        break;
      case "update":
        this.initForms();
        this.id = this.data.codigo;
        this.sesion = this.data.sesion;
        // this.title = "Editar Usuario" + " " + this.id;
        this.title = "Editar Usuario";
        break;
    }
  }

  initForms() {
    this.getDataInit();
    this.formUsuario = new FormGroup({
      name: new FormControl("",[Validators.required]),
      phone: new FormControl(""),
      cedula : new FormControl(""),
      email: new FormControl("",[Validators.email, Validators.required,this.customEmailValidator]),
      fecha_de_nacimiento: new FormControl(""),
      password: new FormControl(""),
      status: new FormControl("", [Validators.required]),
      codigo_de_ciudad: new FormControl(""),
      role: new FormControl("", [Validators.required]),
      login: new FormControl(this.sesion),
    });
  }

  customEmailValidator(control: FormControl): { [key: string]: any } | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailPattern.test(control.value)) {
        return { 'invalidEmail': true };
    }
    return null;
}

  getDataInit() {
    this.loading.emit(false);
    this.WebApiService.getRequest(this.endpoint, {
      action: "getParamsUpdate",
      idCod: this.data.codigo,
      role: this.cuser.role,
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
    }).subscribe(
      (data) => {
        if (data.success == true) {
          this.typeStatus = data.data["status"];
         
          this.typeRol = data.data["typeRol"];
          this.city = data.data["city"];

          let datos = data.data;
          this.loading.emit(false);

          this.formUsuario.get('fecha_de_nacimiento').valueChanges.subscribe((dateOfBirth:any) => {
            const age = this.calculateAge(dateOfBirth);
            if (age < 18) {
                this.formUsuario.get('fecha_de_nacimiento').setErrors({ isUnderage: true });
            } else {
                this.formUsuario.get('fecha_de_nacimiento').setErrors(null);
            }
        });

          if (this.view == "update") {
            this.getDataUpdate();
          }
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

  onSubmit() {
    if (this.formUsuario.valid) {
      this.loading.emit(true);
     const fecha =new Date(this.formUsuario.get('fecha_de_nacimiento').value);
      let year = fecha.getFullYear();
      let mes = fecha.getMonth() +1;
      let day = fecha.getDate();
      const fec_fin = `${year}-${mes}-${day}`;    
      
      this.formUsuario.get('fecha_de_nacimiento').setValue(fec_fin);
      

      let body = {
        usuarios: this.formUsuario.value,
      };
      console.log(body);
      
      this.WebApiService.postRequest(this.endpoint, body, {
        token: this.cuser.token,
        id: this.cuser.id,
        modulo: this.component,
      }).subscribe(
        (data) => {
          if (data.success == true && data.info == false) {
            this.handler.showSuccess(data.message);
            this.reload.emit();
            this.closeDialog();
          } else if(data.success == true && data.info == true){
            this.handler.shoWarning(data.title, data.message);
            this.loading.emit(false);
          }else{
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

  getDataUpdate() {
    console.log('****',this.cuser.id);
    
    this.loading.emit(true);
    this.WebApiService.getRequest(this.endpoint, {
      action: "getParamUpdateSet",
      idCod: this.data.codigo,
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
    }).subscribe(
      (data) => {
        if (data.success) {
          
          this.formUsuario
            .get("name")
            .setValue(data.data["getDataUpda"][0].name);
          this.formUsuario
            .get("cedula")
            .setValue(data.data["getDataUpda"][0].cedula);
          this.formUsuario
            .get("role")
            .setValue(data.data["getDataUpda"][0].role);
          this.formUsuario
            .get("status")
            .setValue(data.data["getDataUpda"][0].status);
          this.formUsuario
            .get("name")
            .setValue(data.data["getDataUpda"][0].name);
          this.formUsuario
            .get("phone")
            .setValue(data.data["getDataUpda"][0].phone);
          this.formUsuario
            .get("fecha_de_nacimiento")
            .setValue(data.data["getDataUpda"][0].fecha_de_nacimiento);
          this.formUsuario
            .get("codigo_de_ciudad")
            .setValue(data.data["getDataUpda"][0].codigo_de_ciudad);
          this.formUsuario
            .get("email")
            .setValue(data.data["getDataUpda"][0].email);
          this.formUsuario
            .get("login")
            .setValue(data.data["getDataUpda"][0].login);
               

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
    if (this.formUsuario.valid) {
      let body = {
        usuario: this.formUsuario.value,
      };
      this.loading.emit(true);
      this.WebApiService.putRequest(this.endpoint + "/" + this.id, body, {
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

  closeDialog() {
    this.dialogRef.close();
  }

 
 
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email Requerido';
    }

    return this.email.hasError('email') ? 'Email Invalido' : '';
  }
  calculateAge(dateOfBirth: Date): number {
    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    let age = currentDate.getFullYear() - dob.getFullYear();
    const currentMonth = currentDate.getMonth();
    const dobMonth = dob.getMonth();
    if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}
}