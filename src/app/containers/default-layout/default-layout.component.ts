import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Tools } from 'src/app/Tools/tools.page';
import { HandlerAppService } from 'src/app/services/handler-app.service';
import { WebApiService } from "../../services/web-api.service";
import { NavItem } from '../../models/nav-item.interface'; 
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

// import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Tools],
})
export class DefaultLayoutComponent {

  navItems: NavItem[] = [];
  public identity;
  public token;
  public cuser:any;
  public userLogin;
  endpoint: string = "/menu";
  public item: any;
  public subitem:any;
  public loading: boolean = false;
  public isLogged: boolean=false;
  public permissions: any[] = Array();


  constructor(
    private _tools: Tools,
    private _router: Router,
    private WebApiService: WebApiService,
    public dialog: MatDialog,
    private handler: HandlerAppService,
  ) {
    this.identity = _tools.getIdentity();
    this.token = _tools.getToken();
    this.cuser = localStorage.getItem("myStoredUser");

    const userLogin = localStorage.getItem('myStoredUser');
    if (userLogin !== null) {
        this.userLogin = JSON.parse(userLogin);
    }
  }

  ngOnInit(): void {
    this.checkToken();
    this.checkSession();
    this.sendRequest();
  }

  sendRequest() {
    let body = {
      id: this.cuser.id,
      token: this.cuser.token
  };
    
    this.WebApiService.postRequest(this.endpoint, this.cuser,{
    }).subscribe(
      (response) => {
        if (response.success) {
          
          this.item = response.data[0];
          this.subitem = response.data[1];
          this.navItems = this.checkMenu(this.item, this.subitem);
          
          this.handler.permissions = this.getpermissionsSaved(this.subitem);
          this.loading = false;
        } else {
          this.handler.handlerError(response);
        }
      },
      (mistake) => {
        let msjErr = "Tu sesión se ha cerrado o el Módulo presenta alguna Novedad";
        //let msjErr = mistake.error.message;
        console.log(mistake);
        
        this.handler.showError(msjErr);
        this.loading = false;
      }
    );
  }
  checkToken() {}

  getpermissionsSaved(subitem:any) {
    var permision: any[] = Array();
    subitem.forEach(function (row:any) {
      let perm = row.perm;
      perm = perm.split("|");
      permision[row.url] = perm;
    });

    return permision;
  }


checkMenu(item: any[], subitem: any[]): NavItem[] {
  const options: NavItem[] = [];

  // Agregar el primer elemento "ADMIN/ UserProfile"
  const adminProfileItem: NavItem = {
    name: `ADMIN/ ${this.userLogin.userProfile}`,
    url: '/dashboard'
  };
  options.push(adminProfileItem);

  // Agregar el título con el nombre de usuario
  const titleItem: NavItem = {
    title: true,
    name: this.userLogin.user,
    url: ''
  };
  options.push(titleItem);

  // Iterar sobre los elementos de "item"
  item.forEach((value: any) => {
    const children: NavItem[] = [];

    // Iterar sobre los elementos de "subitem"
    subitem.forEach((row: any) => {
      if (value.id === row.item) {
        const subItem: NavItem = {
          name: row.name,
          url: row.url,
          icon: row.icon
        };
        children.push(subItem);
      }
    });

    // Crear el elemento de menú principal
    const menuItem: NavItem = {
      name: value.item,
      url: '/admin',
      icon: value.icon,
      children: children
    };

    options.push(menuItem);
  });

  return options;
}

  checkSession() {
    // ejecutar consulta al servidor para verificar si el token es valido aun...
    this.cuser = localStorage.getItem('myStoredUser');
    this.cuser = JSON.parse(this.cuser);
        
    //Variables
    let body = {
      id: this.cuser.id,
      token: this.cuser.token,
      role: this.cuser.rol,
    };
    
    //Validar Informacion del token
    if (this.cuser != null) {
      this.WebApiService.postRequest("/checktoken", body, {}).subscribe(
        (response) => {
          if (
            this.cuser.user != null &&
            this.cuser.token != null &&
            this.cuser.cedula != null &&
            response.success
          ) {
            // console.log('respose 1',response);

            let route = window.location.pathname;
            // console.log('ruta 1',route);

            if (route == "/") {
              this._router.navigate(["dashboard"]);

            } else {
              this._router.navigate([route]);
            }
            this.isLogged = true;
          } else {
            this.isLogged = false;
            this.cuser = null;
            localStorage.removeItem("myStoredUserisLogged");
            localStorage.removeItem("myStoredUser");
            this._router.navigate(["/"]);
            this.handler.handlerError(response.message);
          }
        },
        (error) => {
          this.isLogged = false;
          this.cuser = null;
          localStorage.removeItem("myStoredUserisLogged");
          localStorage.removeItem("myStoredUser");
          this._router.navigate(["/"]);
          this.handler.handlerError("(E): " + error.message);
        }
      );
    } else {
      this.isLogged = false;
      let search;
      let filter: { [key: string]: string } = {};
      if (window.location.search != "") {
        search = window.location.search.replace("?", "");
        search = search.split("&");
        search.forEach((element) => {
          let aux = element.split("=");
          filter[aux[0]] = aux[1];
        });
        this._router.navigate(["/login"], { queryParams: filter });
      } else {
        this._router.navigate(["/login"]);
      }
  }
}

}
