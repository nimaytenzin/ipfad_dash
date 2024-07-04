import { NgModule, isDevMode } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminLayoutModule } from './presentations/layout/admin/admin-layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TenantLayoutModule } from './presentations/layout/tenant/tenant-layout.module';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        AdminLayoutModule,
        TenantLayoutModule,
        ToastModule,
        RecaptchaV3Module,

        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: false,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        MessageService,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: '6Lc8HAgqAAAAAJugjiHqmlDf9XPHE5FOh0ifdcEe',
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
