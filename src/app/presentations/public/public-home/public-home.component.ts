import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
    COMPANY_NAME,
    ZHIDHAYCONTACTDETAILS,
} from 'src/app/core/constants/constants';
import {
    RECAPTCHA_V3_SITE_KEY,
    ReCaptchaV3Service,
    RecaptchaV3Module,
} from 'ng-recaptcha';
import { RecaptchaService } from 'src/app/core/dataservice/recaptcha.dataservice';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { UnitDataService } from 'src/app/core/dataservice/units/unit.dataservice';
import { UnitDTO } from 'src/app/core/dto/units/unit.dto';
import { GalleriaModule } from 'primeng/galleria';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';

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
        SidebarModule,
        InputTextareaModule,
        InputGroupModule,
        DividerModule,
        InputGroupAddonModule,
        CardModule,
        RecaptchaV3Module,
        GalleriaModule,
        TabViewModule,
    ],
    providers: [],
})
export class PublicHomeComponent implements OnInit, AfterViewInit {
    @ViewChild('hContainer') hContainer: ElementRef;
    @ViewChild('centerElement') centerElement!: ElementRef;

    @ViewChildren('tabPanel') tabPanels!: QueryList<ElementRef>;

    showRequestDemoModal: boolean = false;
    zhidhayContactDetails = ZHIDHAYCONTACTDETAILS;
    characterLimit = 100;
    characterCountExceeded: boolean = false;
    listedUnits: UnitDTO[] = [];
    currentYear = new Date().getFullYear();
    date: Date | undefined;
    companyName: string = COMPANY_NAME;
    requestDemoForm: FormGroup;
    activeIndex = 0;
    captcha: any;
    buildingImages = [
        'https://www.waytobhutan.com/wp-content/uploads/2020/02/dscf26071-1024x768.jpg',
        'https://media.architecturaldigest.com/photos/5aa7f0882ed63a101d5619f3/master/w_1600%2Cc_limit/amankora-gangtey-bhutan-dining.jpg.jpg',
    ];
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private recaptchaV3Service: ReCaptchaV3Service,
        private recaptchaVerificationService: RecaptchaService,

        private messageService: MessageService,
        private unitDataService: UnitDataService,
        private renderer: Renderer2
    ) {
        this.requestDemoForm = this.fb.group({
            name: [],
            phoneNumber: [],
            remarks: new FormControl({ value: '', disabled: false }, [
                Validators.maxLength(this.characterLimit),
            ]),
            preferredDemoDate: [],
        });
    }

    ngOnInit() {
        this.unitDataService.GetUnitListings().subscribe({
            next: (res) => {
                this.listedUnits = res;
            },
        });
    }

    ngAfterViewInit() {
        this.setEqualHeight();
        window.addEventListener('resize', () => this.setEqualHeight());
    }

    setEqualHeight() {
        const heights = this.tabPanels.map(
            (panel) => panel.nativeElement.offsetHeight
        );
        const maxHeight = Math.max(...heights);
        this.tabPanels.forEach((panel) => {
            this.renderer.setStyle(
                panel.nativeElement,
                'height',
                `${maxHeight}px`
            );
        });
    }

    login() {
        this.router.navigate(['auth']);
    }

    onTextareaInput(event: Event): void {
        const value = (event.target as HTMLTextAreaElement).value;
        if (value.length > this.characterLimit) {
            this.characterCountExceeded = true;
        }
    }

    getRemarksCharCount(): number {
        const remarksControl = this.requestDemoForm.get('remarks');
        if (remarksControl) {
            const remarksValue = remarksControl.value;
            return remarksValue ? remarksValue.length : 0;
        }
        return 0;
    }
    requestDemo() {
        const formValue = this.requestDemoForm.value;
        let dateObj = new Date(formValue.preferredDemoDate);

        let month = dateObj.toLocaleString('default', { month: 'short' }); // Gets abbreviated month name
        let day = dateObj.getDate(); // Gets the day of the month
        let year = dateObj.getFullYear(); // Gets the full year

        let formattedDate = `${month} ${day} ${year}`;

        const message = `${formValue.name},#${formValue.phoneNumber} has requested a demo on ${formattedDate}.message: ${formValue.remarks}`;

        this.recaptchaV3Service
            .execute('RequestingDemoForZhidhay')
            .subscribe((token) => {
                this.recaptchaVerificationService
                    .Requestdemo(token, message)
                    .subscribe((res) => {
                        if (res) {
                            this.showRequestDemoModal = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Demo request has been sent.',
                                detail: 'Our Team will contact you shortly with the details.',
                            });
                        }
                    });
            });
    }
}
