import { Component, Input, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuildingImageDataService } from 'src/app/core/dataservice/building/building-image.dataservice';
import { API_URL } from 'src/app/core/constants/constants';
import { BuildingImageDTO } from 'src/app/core/dto/properties/building-image.dto';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-admin-building-photos',
    templateUrl: './admin-building-photos.component.html',
    styleUrls: ['./admin-building-photos.component.scss'],
    standalone: true,
    imports: [
        GalleriaModule,
        ButtonModule,
        ImageModule,
        FileUploadModule,
        ConfirmDialogModule,
        CarouselModule,
    ],
    providers: [ConfirmationService],
})
export class AdminBuildingPhotosComponent implements OnInit {
    @Input({ required: true }) buildingId: number;
    @Input({ required: true }) editMode: boolean;

    buildingImages: BuildingImageDTO[] = [];
    selectedFile: File | null = null;

    constructor(
        private buildingImageService: BuildingImageDataService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getBuildingImages();
    }

    getBuildingImages() {
        this.buildingImageService
            .GetBuildingImageByBuilding(this.buildingId)
            .subscribe((res) => {
                this.buildingImages = res;
            });
    }

    getBuildingImageUrl(item: BuildingImageDTO) {
        return API_URL + '/' + item.uri;
    }

    onFileSelected(event: any) {
        this.selectedFile = event.files[0];
    }

    uploadImage() {
        if (!this.selectedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a file',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('buildingId', this.buildingId.toString());

        this.buildingImageService.CreateBuildingImage(formData).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Image uploaded successfully',
                });

                this.getBuildingImages();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Image upload failed',
                });
            },
        });
    }

    confirmDeletePhoto(item: BuildingImageDTO) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this Image?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',

            accept: () => {
                this.buildingImageService
                    .DeleteBuildingImage(item.id)
                    .subscribe((res) => {
                        if (res) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Confirmed',
                                detail: 'Record deleted',
                            });
                            this.getBuildingImages();
                        }
                    });
            },
        });
    }
}
