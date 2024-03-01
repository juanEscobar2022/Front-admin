import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Tools } from '../../../Tools/tools.page';
import { WebApiService } from '../../../services/web-api.service';
// import { ModalDirective } from 'ngx-bootstrap/modal';
import { HandlerAppService } from '../../../services/handler-app.service';
import { global } from '../../../services/global';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { UserServices } from '../../../services/user.service';
import { RoleDialog } from 'src/app/dialogs/role/role.dialog.component';
// import { RoleDialog } from '../../../dialogs/role/role.dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [Tools]
})
export class RolesComponent implements OnInit {
  [x: string]: any;

  public data:any;
  public detailRoles = [];
  dataroles: any = [];
  dataSource: any = [];
  displayedColumns: any = [];
  loading: boolean = false;
  ValorRol: any = [];

   
  component = "/admin/roles";
  permissions: any = null;
  contaClick:  number = 0;
  endpoint: string = '/rol';

  
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor( 
    private _tools: Tools,
    private WebApiService: WebApiService,
    public handler: HandlerAppService,
    public dialog: MatDialog) { }

  // @ViewChild('infoModal', { static: false }) public infoModal: ModalDirective;
  //  public cuser: any = JSON.parse(localStorage.getItem('currentUser'));
  public cuser: any;

   

  ngOnInit(): void {
    this.permissions = this.handler.permissionsApp;
   this.sendRequest();
   this.cuser = localStorage.getItem('myStoredUser');
   this.cuser = JSON.parse(this.cuser)
   
  }
  
  sendRequest() {
    this.cuser = localStorage.getItem('myStoredUser');
    this.cuser = JSON.parse(this.cuser);
    
    this.loading = true;
    this.WebApiService.getRequest(this.endpoint, {
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component
    })
      .subscribe(
        response => {
          
          if (response.success) {
            this.permissions = this.handler.getPermissions(this.component);            
            this.generateTable(response.data);
            this.ValorRol = response.data
            this.loading = false;
          } else {
            this.loading = false;
            this.ValorRol = [];
            this.handler.handlerError(response);
          }
        },
        (mistake) => {
          let msjErr = "Tu sesión se ha cerrado o el Módulo presenta alguna Novedad";
          //let msjErr = mistake.error.message;
          this.handler.showError(msjErr);
          this.loading = false;
        }
      );
  }

  generateTable(data: any) {
    this.displayedColumns = [
      'view',
      'idRole',
      'surname',
      'description',
      'actions'
    ];
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource.paginator = this.paginator.toArray()[0];
    
    // Verificar si el elemento 'search-input-table' existe en el documento
    const searchInput = document.querySelector('.search-input-table') as HTMLInputElement;
    if (searchInput !== null) {
      searchInput.value = '';
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  showDetails(item:any) {
    this.detailRoles = item;
    // this.infoModal.show();
  }
  option(action:any,codigo=null){

            var dialogRef;
            switch(action){

            case 'view':
                    this.loading = true;
                    dialogRef = this.dialog.open(RoleDialog,{
                      data: {
                        window: 'view',
                        codigo
                      }
                    });
                    dialogRef.disableClose = true;
                    // LOADING
                    dialogRef.componentInstance.loading.subscribe((val:any)=>{
                      this.loading = val;
                    });
                    dialogRef.afterClosed().subscribe(result => {
                      console.log('The dialog was closed');
                      console.log(result);
                    });
                break;
                case 'create':
                  this.loading = true;
                  dialogRef = this.dialog.open(RoleDialog,{
                    data: {
                      window: 'create',
                      codigo
                    }
                  });
                  dialogRef.disableClose = true;
                  // LOADING
                  dialogRef.componentInstance.loading.subscribe((val:any)=>{
                    this.loading = val;
                  });
                  // RELOAD
                  dialogRef.componentInstance.reload.subscribe((val:any)=>{
                    this.sendRequest();
                  });
              break;
              case 'update':
                this.loading = true;
                dialogRef = this.dialog.open(RoleDialog, {
                  data: {
                    window: 'update',
                    codigo
                  }
                });
                dialogRef.disableClose = true;
                // LOADING
                dialogRef.componentInstance.loading.subscribe((val:any) => {
                  this.loading = val;
                });
                // RELOAD
                dialogRef.componentInstance.reload.subscribe((val:any) => {
                  this.sendRequest();
                });
                break;

      }



  }
  
  openc(){
    if(this.contaClick == 0){
      this.sendRequest();
    }    
    this.contaClick = this.contaClick + 1;
  }
}
