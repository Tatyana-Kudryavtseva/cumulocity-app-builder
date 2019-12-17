import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {ApplicationService, ApplicationAvailability, ApplicationType} from '@c8y/client';
import {AppStateService} from "@c8y/ngx-components";

@Component({
    template: `
    <div class="modal-header text-center bg-primary">
        <div style="font-size: 62px;">
            <span c8yIcon="c8y-modules"></span>
        </div>
        <h4 class="text-uppercase" style="margin:0; letter-spacing: 0.15em;">Add application</h4>
    </div>
    <div class="modal-body c8y-wizard-form">
        <form name="newAppBuilderAppForm" class="c8y-wizard-form">
            <div class="form-group">
                <label for="name"><span>Name</span></label>
                <input type="text" class="form-control" id="name" name="name" placeholder="e.g. My First Application (required)" required [(ngModel)]="appName">
            </div>
            
            <div class="form-group">
                <label for="icon"><span>Icon</span></label>
                <icon-selector id="icon" name="icon" [(value)]="appIcon"></icon-selector>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="createApplication()">Save</button>
    </div>
  `
})

export class NewApplicationModalComponent {
    appName: string;
    appIcon: string = 'bathtub';

    constructor(public bsModalRef: BsModalRef, private appService: ApplicationService, private appStateService: AppStateService) {}

    async createApplication() {
        this.bsModalRef.hide();

        const app = (await this.appService.create({
            name: this.appName,
            availability: ApplicationAvailability.PRIVATE,
            type: ApplicationType.EXTERNAL,
            key: `application-builder-${this.appName}-app-key`,
            externalUrl: `${window.location.pathname}#/application-builder`
        })).data;
        await this.appService.update({
            id: app.id,
            externalUrl: `${window.location.pathname}?app=${app.id}#/application/${app.id}`,
            applicationBuilder: {
                version: __VERSION__,
                branding: {
                    colors: {
                        primary: '#1776BF',
                        active: '#14629F',
                        text: '#333333',
                        textOnPrimary: 'white',
                        textOnActive: 'white'
                    }
                },
                dashboards: [],
                icon: this.appIcon
            },
            icon: {
                name: this.appIcon,
                "class": `fa fa-${this.appIcon}`
            },
        } as any);

        // Refresh the applications list
        this.appStateService.currentUser.next(this.appStateService.currentUser.value);
    }
}