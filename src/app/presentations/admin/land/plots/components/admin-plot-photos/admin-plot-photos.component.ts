import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { API_URL } from 'src/app/core/constants/constants';
import { BuildingImageDataService } from 'src/app/core/dataservice/building/building-image.dataservice';
import { PlotImageDTO } from 'src/app/core/dataservice/land/dto/plot.dto';
import { PlotImageDataservice } from 'src/app/core/dataservice/land/plot-image.dataservice';
import { BuildingImageDTO } from 'src/app/core/dto/properties/building-image.dto';

@Component({
    selector: 'app-admin-plot-photos',
    templateUrl: './admin-plot-photos.component.html',
    styleUrls: ['./admin-plot-photos.component.scss'],
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
export class AdminPlotPhotosComponent implements OnInit {
    @Input({ required: true }) plotDatabaseId: number;
    @Input({ required: true }) editMode: boolean;

    plotImages: PlotImageDTO[] = [];
    selectedFile: File | null = null;

    constructor(
        private plotImageDataservice: PlotImageDataservice,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getPlotImages();
    }

    getPlotImages() {
        this.plotImageDataservice
            .GetPlotImageByplot(this.plotDatabaseId)
            .subscribe((res) => {
                this.plotImages = res;
            });
    }

    getPlotImageUrl(item: PlotImageDTO) {
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
        formData.append('plotDatabaseId', this.plotDatabaseId.toString());

        this.plotImageDataservice.CreatePlotImage(formData).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Image uploaded successfully',
                });

                this.getPlotImages();
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
                this.plotImageDataservice
                    .DeletePlotImage(item.id)
                    .subscribe((res) => {
                        if (res) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Confirmed',
                                detail: 'Record deleted',
                            });
                            this.getPlotImages();
                        }
                    });
            },
        });
    }
}
