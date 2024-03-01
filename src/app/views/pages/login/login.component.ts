import { Component, ViewEncapsulation } from "@angular/core";
import { LoginServices } from "../../../services/login.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../../models/users";
import { Tools } from "../../../Tools/tools.page";
import { EncryptService } from "../../../services/encrypt.service";
import { WebApiService } from "../../../services/web-api.service";
import { from } from "rxjs";
import Swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HandlerAppService } from "../../../services/handler-app.service";
import { CookieService } from 'ngx-cookie-service'; // Importa el servicio de cookies si estás utilizando Angular


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginServices, Tools],

})
export class LoginComponent {

  public loginData: User;
  public status: string;
  public identity: any;
  public token: any;
  public isLogged: boolean;
  public cuser: any;
  // public cuser: any = localStorage.getItem("currentUser"

  hide = true;

  public loading: boolean = false;
  validateUser = false;

  viewMessage: boolean = false;
  view: string = "login";

  loginForm:any = FormGroup;

  constructor(
  
    private _loginService: LoginServices,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tools: Tools,
    private WebApiService: WebApiService,
    private Encrypt: EncryptService,
    public handler: HandlerAppService,
    private cookieService: CookieService
  ) {
    this.loginData = new User(1, "", "", "", "", 0);
    this.status= '';
    this.isLogged = false;
  }

  ngOnInit(): void {
    this.checkSession();
    this.initForm(this.view);
  }

  checkSession() {
    // ejecutar consulta al servidor para verificar si el token es valido aun...
    this.cuser = localStorage.getItem("myStoredUser");

    this.cuser = JSON.parse(this.cuser);

    if (this.cuser != null) {
      
      this.WebApiService.token = this.cuser.token;
      console.log(this.WebApiService.token);
      
      if (
        this.cuser.user != null &&
        this.cuser.token != null &&
        this.cuser.cedula != null
      ) {
        this._router.navigate(["/dashboard"]);
        this.isLogged = true;
      }
    }
  }

  initForm(type: string) {
    switch (type) {
      case "login":
        this.loginForm = new FormGroup({
          fuser: new FormControl("", [Validators.required]),
          fpass: new FormControl("", [Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)]),
        });
        break;
    }
  }

  onSubmit() {
    this.validateUser = true;

    this._loginService.login(this.loginData).subscribe(
      (response) => {
        this.identity = response.resultado.response;
        this.token = response.resultado.token;
        console.log(this.token);
        console.log(this.token);
        
        // PERSISTIR USUARIO
        localStorage.setItem("identity", JSON.stringify(this.identity));
        localStorage.setItem("token", JSON.stringify(this.token));
        // localStorage.setItem("cantNoti", "0");

        // redrigir pagina
        this._router.navigate(["./dashboard"]);
      },
      (error) => {
        //console.log(error);
        if (error.status == 500) {
          this._tools.showNotify("error", "PERSONALE", "Error interno");
        }
        if (error.status == 404) {
          this._tools.showNotify(
            "error",
            "PERSONALE",
            <any>error.error.resultado
          );
        }
      }
    );
  }

  signin() {
    if (this.loginForm.valid) {
        let body = {
            fuser: this.loginForm.get("fuser").value,
            fpass: this.Encrypt.encrypt(this.loginForm.get("fpass").value),
        };

        this.loading = true;
        this.WebApiService.postRequest("/login", body, {}).subscribe(
            (data) => {
                if (data.success == true && data.info == false) {
                    let objData = {
                        token: data.token,
                        user: data.user,
                        cedula: data.cedula,
                        action: data.action,
                        userProfile: data.userProfile,
                        role: data.rol,
                        id: data.id,
                    };

                    // Almacena los datos del usuario en localStorage
                    localStorage.setItem("myStoredUser", JSON.stringify(objData));

                    // Establece una bandera en localStorage para indicar que el usuario está autenticado
                    localStorage.setItem("myStoredUserisLogged", "true");

                    this.WebApiService.token = data.token;
                    this._tools.isLogged = true;
                    this._router.navigate(["/dashboard"]);
                } else if(data.success == true && data.info == true) {
                    this.loading = false;
                    this._tools.isLogged = false;
                    this.loginForm.get("fpass").setValue("");
                    this.handler.showInfo(data.message, data.title, '#/login');
                } else {
                    this.loading = false;
                    this._tools.isLogged = false;
                    this.loginForm.get("fpass").setValue("");
                    this.handler.shoWarning('¡Atención!', data.message);
                }
            },
            (error) => {
                this.loading = false;
                this._tools.isLogged = false;
                this.loginForm.get("fpass").setValue("");
                console.error(error);
            }
        );
    } else {
        this.viewMessage = true;
    }
}

}
