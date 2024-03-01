

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


// import { TextMaskModule } from 'angular2-text-mask';
// import { SelectModule } from 'ng-select';
// import { NavbarsComponent } from './navbars/navbars.component';

// Components Routing
import { AdministratorRoutingModule } from './administrador-routing.module';
import { UsersComponent } from './users/users.component'
// import { ListsComponent } from './lists/lists.component';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { StateComponent } from './state/state.component';

// Modal Component
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { DatafilterModule } from '../../Tools/pipe/datafilter.module';
import { MatInputModule }  from '@angular/material/input';
// import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { RolesComponent } from './roles/roles.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule,MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PaginationModule } from '@coreui/angular';
import {MatDialog} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';


// import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';


// import { CalendarComponent } from './calendar/calendar.component';
// import { ContactComponent } from './contact/contact.component';
// import { ModuleComponent } from './permission/module.component';
// import {MatMenuModule} from '@angular/material/menu';
// import {MatButtonModule} from '@angular/material/button';
// import {MatIconModule} from '@angular/material/icon';

// const ngWizardConfig: NgWizardConfig = {
//   theme: THEME.arrows
// };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdministratorRoutingModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatInputModule,
    PaginationModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule
    // MatPaginatorIntl 

    // // DataTableModule,
    // ReactiveFormsModule,
    // SelectModule,
    // TextMaskModule,
    // ModalModule,
    // DatafilterModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatTableModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatProgressSpinnerModule,
    // MatFormFieldModule,
    // BsDropdownModule,
    // TabsModule,
    // MatMenuModule,
    // MatButtonModule,
    // MatIconModule,
    // BsDropdownModule.forRoot(),
    // NgWizardModule.forRoot(ngWizardConfig)

  ],
  declarations: [
    // NavbarsComponent,
    UsersComponent,
    // ListsComponent,
    // // StateComponent,
    RolesComponent,
    // // CalendarComponent,
    // // ContactComponent,
    // ModuleComponent


  ]
})
export class AdministradorModule { }
