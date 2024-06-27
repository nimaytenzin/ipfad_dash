import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './presentations/layout/app.layout.module';
import { AdminLayoutModule } from './presentations/layout/admin/admin-layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        AdminLayoutModule,
        ToastModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
