import {RegisterComponent} from './views/pages/register/register.component';
import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import { NgScrollbarModule } from 'ngx-scrollbar';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { LoginComponent } from './views/pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { OnlynumberDirective } from "./Tools/onlynumber.directive";
import { Tools } from './Tools/tools.page';
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RoleDialog } from "./dialogs/role/role.dialog.component";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { UsersDialog } from './dialogs/users/users.dialog.component';
import { CategoryDialog } from './dialogs/category/category.dialog.component';
import {MatCardModule} from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';



const routes: Routes = [];


const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent,
    APP_CONTAINERS,
    LoginComponent,
    OnlynumberDirective,
    RoleDialog,
    UsersDialog,
    CategoryDialog
    // RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    HttpClientModule ,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatPaginatorModule,
    PaginationModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    RouterModule.forRoot(routes),
    MatDatepickerModule,
    CommonModule
    
    
    
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    Tools,

    IconSetService,
    Title,
    DatePipe,
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],

})
export class AppModule {
}
