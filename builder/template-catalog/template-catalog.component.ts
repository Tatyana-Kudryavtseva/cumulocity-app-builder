import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { IManagedObject } from '@c8y/client';
import { DeviceSelectorModalComponent } from "../utils/device-selector/device-selector.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { DeviceDescription, TemplateCatalogEntry, TemplateDetails } from "./template-catalog.model";
import { TemplateCatalogService } from "./template-catalog.service";

enum TemplateCatalogStep {
    CATALOG,
    DETAIL_PAGE
}

@Component({
    selector: 'template-catalog',
    templateUrl: './template-catalog.component.html',
    styleUrls: ['template-catalog.less'],
    encapsulation: ViewEncapsulation.None,
})
export class TemplateCatalogModalComponent implements OnInit {

    app: any;

    private currentStep: TemplateCatalogStep = TemplateCatalogStep.CATALOG;

    private deviceSelectorModalRef: BsModalRef;

    public templates: Array<TemplateCatalogEntry> = [];

    public selectedTemplate: TemplateCatalogEntry;

    public templateDetails: TemplateDetails;

    public isLoadingIndicatorDisplayed = false;

    public dashboardConfiguration = {
        dashboardId: '12598412',
        dashboardName: '',
        dashboardIcon: 'th',
        deviceId: '',
        tabGroup: '',
        dashboardVisibility: ''
    };

    public selectedDevice: IManagedObject;

    constructor(private modalService: BsModalService, private modalRef: BsModalRef, private catalogService: TemplateCatalogService) { }

    ngOnInit(): void {
        this.loadTemplateCatalog();
    }

    loadTemplateCatalog(): void {
        this.showLoadingIndicator();
        this.catalogService.getTemplateCatalog().subscribe((catalog: Array<TemplateCatalogEntry>) => {
            this.hideLoadingIndicator();
            this.templates = catalog;
        });
    }

    onTemplateClicked(template: TemplateCatalogEntry): void {
        this.selectedTemplate = template;
        this.showDetailPage();
        this.loadTemplateDetails(template);
    }

    loadTemplateDetails(template: TemplateCatalogEntry): void {
        this.showLoadingIndicator();
        this.catalogService.getTemplateDetails(template.dashboard).subscribe(templateDetails => {
            this.hideLoadingIndicator();
            this.templateDetails = templateDetails;
        });
    }

    showDetailPage(): void {
        this.currentStep = TemplateCatalogStep.DETAIL_PAGE;
    }

    showCatalogPage(): void {
        this.currentStep = TemplateCatalogStep.CATALOG;
    }

    openDeviceSelectorDialog(index: number): void {
        this.deviceSelectorModalRef = this.modalService.show(DeviceSelectorModalComponent, { class: 'c8y-wizard', initialState: {} });
        this.deviceSelectorModalRef.content.onDeviceSelected.subscribe((selectedDevice: IManagedObject) => {
            this.templateDetails.input.devices[index].reprensentation = {
                id: selectedDevice.id,
                name: selectedDevice['name']
            };
        })
    }

    onImageSelected(files: FileList, index: number): void {
        this.catalogService.uploadImage(files.item(0)).then((binaryId: string) => {
            this.templateDetails.input.images[index].id = binaryId;
        });
    }

    resetTemplateDetails(): void {
        this.selectedTemplate = undefined;
        this.templateDetails = undefined;
    }

    onBackButtonClicked(): void {
        this.resetTemplateDetails();
        this.showCatalogPage();
    }

    onCancelButtonClicked(): void {
        this.modalRef.hide();
    }

    onSaveButtonClicked(): void {
        this.catalogService.createDashboard(this.app, this.dashboardConfiguration, this.selectedTemplate, this.templateDetails);
        this.modalRef.hide();
    }

    isSaveButtonEnabled(): boolean {
        return this.templateDetails && (!this.templateDetails.input.devices || this.templateDetails.input.devices.length === 0 || this.isDevicesSelected());
    }

    isCatalogDisplayed(): boolean {
        return this.currentStep == TemplateCatalogStep.CATALOG;
    }

    isDetailPageDisplayed(): boolean {
        return this.currentStep == TemplateCatalogStep.DETAIL_PAGE;
    }

    showLoadingIndicator(): void {
        this.isLoadingIndicatorDisplayed = true;
    }

    hideLoadingIndicator(): void {
        this.isLoadingIndicatorDisplayed = false;
    }

    private isDevicesSelected(): boolean {
        if (!this.templateDetails.input.devices || this.templateDetails.input.devices.length === 0) {
            return true;
        }

        for (let device of this.templateDetails.input.devices) {
            if (!device.reprensentation) {
                return false;
            }
        }

        return true;
    }
}