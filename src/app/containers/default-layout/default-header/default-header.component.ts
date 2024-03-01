import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { cilList, cilShieldAlt,cilAccountLogout } from '@coreui/icons';
import { WebApiService } from "../../../services/web-api.service";
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  public cuser: any;
  public isLogged: boolean=false;
  public loading: boolean = false;


  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  icons = { cilList, cilShieldAlt, cilAccountLogout};
  constructor(private classToggler: ClassToggleService,
    private WebApiService: WebApiService,
    private handler: HandlerAppService,
    private _router: Router,


    ) {
    super();
  }
  
  logout() {
    this.cuser = localStorage.getItem('myStoredUser');
    this.cuser = JSON.parse(this.cuser)
    let body = {
      id: this.cuser.id,
      role: this.cuser.role,
      token: this.cuser.token,
      username: this.cuser.cedula,
    };
    //Limpieza
    this.isLogged = false;
    this.cuser = null;

    this.WebApiService.postRequest("/logout", body, {}).subscribe(
      (response) => {
        if (response.success) {
          this.handler.showSuccess(
            "Sesión culminada con éxito, gracias hasta pronto."
          );
        } else {
          this.handler.handlerError("Error: " + response);
        }
      },
      (error) => {
        this.loading = false;
        this.handler.showError(error.message);
      }
    );

    localStorage.removeItem("myStoredUserisLogged");
    localStorage.removeItem("myStoredUser");
    this._router.navigate(["/"]);
  }
}
