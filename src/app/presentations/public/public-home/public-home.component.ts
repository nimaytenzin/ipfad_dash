import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ZHIDHAYCONTACTDETAILS } from 'src/app/core/constants/constants';
import {
    RECAPTCHA_V3_SITE_KEY,
    ReCaptchaV3Service,
    RecaptchaV3Module,
} from 'ng-recaptcha';
import { RecaptchaService } from 'src/app/core/dataservice/recaptcha.dataservice';
import { NotificationService } from 'src/app/core/dataservice/notification.service';

@Component({
    selector: 'app-public-home',
    templateUrl: './public-home.component.html',
    styleUrls: ['./public-home.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        ReactiveFormsModule,
    ],
    providers: [],
})
export class PublicHomeComponent implements OnInit, AfterViewInit {
    @ViewChild('hContainer') hContainer: ElementRef;
    @ViewChild('centerElement') centerElement!: ElementRef;
    showRequestDemoModal: boolean = false;
    zhidhayContactDetails = ZHIDHAYCONTACTDETAILS;

    date: Date | undefined;

    requestDemoForm: FormGroup;
    captcha: any;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private recaptchaV3Service: ReCaptchaV3Service,
        private recaptchaVerificationService: RecaptchaService,
        private notificationService: NotificationService
    ) {
        this.requestDemoForm = this.fb.group({
            name: [],
            phoneNumber: [],
            numberOfUnits: [],
            preferredDemoDate: [],
        });
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        gsap.from(this.centerElement.nativeElement, {
            duration: 1,
            opacity: 0,
            scale: 1.19, // Scale up to 1.5 times its original size
            // Move it up by 100% of its height
            ease: 'power1.out', // Use a power1 easing function for a smooth start and end
            delay: 0, // Start the animation after a half-second delay
        });
        // gsap.fromTo(
        //     '.cloud1',
        //     { left: '0%' },
        //     {
        //         left: '30%',
        //         top: '50%',
        //         duration: 5000,
        //         repeat: 1,
        //         opacity: 0,
        //         ease: 'linear',
        //         scrollTrigger: {
        //             trigger: '.cloud1',
        //             start: 'top bottom', // Start the animation when the top of the element hits the bottom of the viewport
        //             end: 'bottom top', // End the animation when the bottom of the element hits the top of the viewport
        //             scrub: true, // Smoothly scrub the animation based on scroll position
        //         },
        //     }
        // );

        gsap.to('.cloud1', {
            left: '100%',
            duration: 230,
            repeat: -1,
            ease: 'linear',
        });
        gsap.to('.cloud2', {
            left: '100%',
            duration: 232,
            repeat: -1,
            ease: 'linear',
        });
        gsap.to('.cloud3', {
            right: '100%',
            duration: 222,
            repeat: -1,
            ease: 'linear',
        });
        gsap.to('.cloud4', {
            right: '100%',
            duration: 232,
            repeat: -1,
            ease: 'linear',
        });
        gsap.to('.cloud5', {
            left: '100%',
            duration: 250,
            repeat: -1,
            ease: 'linear',
        });
        // const items = document.querySelectorAll('.data');

        // gsap.from(items, {
        //     textContent: 0,
        //     duration: 4,
        //     ease: 'power1.in',
        //     snap: { textContent: 1 },
        //     onUpdate: function () {
        //         this.targets()[0].innerHTML = this.numberWithCommas(
        //             Math.ceil(this.targets()[0].textContent)
        //         );
        //     },
        // });
    }

    login() {
        this.router.navigate(['auth']);
    }

    requestDemo() {
        const formValue = this.requestDemoForm.value;
        const message = `${formValue.name} has requested a demo on ${formValue.preferredDemoDate}. Number of units: ${formValue.numberOfUnits}. Contact: ${formValue.phoneNumber}`;

        this.recaptchaV3Service
            .execute('RequestingDemoForZhidhay')
            .subscribe((token) => {
                console.log('REcAPCHA TOKEN ', token);
                this.recaptchaVerificationService
                    .VerifyToken(token)
                    .subscribe((res) => {
                        console.log('token verificaiotn results', res);
                        if (res.success === true) {
                            this.notificationService
                                .SendSMS({
                                    contact: 17263764,
                                    message: message,
                                })
                                .subscribe((message: any) => {
                                    if (message.status === 'Success') {
                                        this.showRequestDemoModal = false;
                                    }
                                });
                        }
                    });
            });
        console.log(this.requestDemoForm.value);
    }
}
