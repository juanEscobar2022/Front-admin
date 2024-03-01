import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Tools } from '../../../Tools/tools.page';
import { UserServices } from '../../../services/user.service';
import { WebApiService } from '../../../services/web-api.service';
// import { ModalDirective } from 'ngx-bootstrap/modal';
import { UsersDialog } from '../../../dialogs/users/users.dialog.component';
import { HandlerAppService } from '../../../services/handler-app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { ReportsUserComponent } from '../../../dialogs/reports/user/reports-user.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CategoryDialog } from 'src/app/dialogs/category/category.dialog.component';
import Swal from "sweetalert2";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  
  public data:any;
  public detailUser = [];
  datauser: any = [];
  contenTable: any = [];
  dataSource: any = [];
  displayedColumns: any = [];
  loading: boolean = false;
  contaClick:  number = 0;
  component = "/customer/category";
  permissions: any = null;
  permiLogout: boolean = false;
  contSesion: number = 0;
  ValorRol: any = [];

  endpoint: string = '/category';
  // log: any = [];
  // sta: any =[];
  public cuser: any = localStorage.getItem("myStoredUser");

  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    // private _UserService: UserServices,
    private _tools: Tools,
    private WebApiService: WebApiService,
    public handler: HandlerAppService,
    private matBottomSheet: MatBottomSheet,
    public dialog: MatDialog) { }


  // @ViewChild('infoModal', { static: false }) public infoModal: ModalDirective;

  ngOnInit(): void {
    this.sendRequest();
    this.permissions = this.handler.permissionsApp;    
   
  }

  sendRequest() {
    this.cuser =  localStorage.getItem("myStoredUser");
    this.cuser = JSON.parse(this.cuser);
    this.loading = true;
    this.WebApiService.getRequest(this.endpoint, {
      role: this.cuser.role,
      token: this.cuser.token,
      id: this.cuser.id,
      modulo: this.component,
      action: "getDataUser"
    })
      .subscribe(
        response => {
          
          if (response.success) {
            this.permissions = this.handler.getPermissions(this.component);
            this.generateTable(response.data['getDataUser']);
            this.ValorRol = response.data['getDataUser'];

            if( this.cuser.role == 1){
              this.permiLogout = true;
            }

            this.loading = false;
          } else {
            this.datauser = [];
            this.handler.handlerError(response);
            this.loading = false;
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
      'id_list',
      'actions'
    ];
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource.paginator = this.paginator.toArray()[0];
    const searchInput = document.querySelector('.search-input-table') as HTMLInputElement;
    if (searchInput !== null) {
      searchInput.value = '';
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  option(action:any, codigo = null,sesion='') {
    var dialogRef;
    switch (action) {
      case 'view':
        this.loading = true;
        dialogRef = this.dialog.open(CategoryDialog, {
          data: {
            window: 'view',
            codigo
          }
        });
        dialogRef.disableClose = true;
        // LOADING
        dialogRef.componentInstance.loading.subscribe((val:any) => {
          this.loading = val;
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log('The dialog was closed');
          // console.log(result);
        });
        break;
      case 'create':
        this.loading = true;
        dialogRef = this.dialog.open(CategoryDialog, {
          data: {
            window: 'create',
            role: this.cuser.role,
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
      case 'update':
        this.loading = true;
        dialogRef = this.dialog.open(CategoryDialog, {
          data: {
            window: 'update',
            codigo,
            // sesion:any
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

  showDetails(item:any) {
    this.detailUser = item;
    // this.infoModal.show()
  }

  
  openc(){
    if(this.contaClick == 0){
      this.sendRequest();
    }    
    this.contaClick = this.contaClick + 1;
  }

  async  deleInfo(id:number) {

      if( id  ){
        const confirmed = await this.confirmDelete();
        if (confirmed) {
        this.loading = true;
        this.WebApiService.getRequest(this.endpoint, {
          action: 'getDelinfo',
          idCat: "" + JSON.stringify(id),
          id: this.cuser.id,
          token: this.cuser.token,
          modulo: this.component
        })
          .subscribe(

            data => {
             
                if (data.success == true) {
                    //DataInfo
                    this.handler.showSuccess('Registros eliminados exitosamente.');
                    this.loading = false;
                    this.sendRequest();
                } else {
                    this.handler.handlerError(data);
                    this.loading = false;
                }
            },
            error => {
                this.handler.showError('Se produjo un error al eliminar los registros');
                this.loading = false;
                // this.stadValue = false;
                this.sendRequest();
              } 
            
          );
      }
    
  }
}
confirmDelete(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    Swal.fire({
      title: '¿Desea eliminar esta categoría?',
      text: 'Por favor haga click de nuevo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true); // Usuario confirmó
      } else {
        resolve(false); // Usuario canceló
      }
    });
  });
}
}
