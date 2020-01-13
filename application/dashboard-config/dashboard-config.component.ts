/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApplicationService, InventoryService} from "@c8y/client";
import {Observable, from, Subject, Subscription} from "rxjs";
import {debounceTime, map, switchMap, tap} from "rxjs/operators";
import {DashboardNavigation} from "../dashboard.navigation";
import {AppStateService} from "@c8y/ngx-components";
import {BrandingService} from "../../branding/branding.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {NewDashboardModalComponent} from "./new-dashboard-modal.component";
import {EditDashboardModalComponent} from "./edit-dashboard-modal.component";

interface DashboardConfig {
    id: string,
    name: string,
    icon: string,
    deviceId?: string
}

@Component({
    templateUrl: './dashboard-config.component.html'
})
export class DashboardConfigComponent implements OnDestroy {
    newAppName: string;
    newAppIcon: string;

    app: Observable<any>;

    delayedAppUpdateSubject = new Subject<any>();
    delayedAppUpdateSubscription: Subscription;

    bsModalRef: BsModalRef;

    constructor(private route: ActivatedRoute, private appService: ApplicationService, private appStateService: AppStateService, private brandingService: BrandingService, private inventoryService: InventoryService, private navigation: DashboardNavigation, private modalService: BsModalService) {
        const appId = route.paramMap.pipe(
            map(paramMap => paramMap.get('applicationId'))
        );

        this.app = appId.pipe(
            switchMap(appId => from(
                appService.detail(appId).then(res => res.data as any)
            )),
            tap(app => { // TODO: do this a nicer way....
                this.newAppName = app.name;
                this.newAppIcon = app.applicationBuilder.icon;
            })
        );

        this.delayedAppUpdateSubscription = this.delayedAppUpdateSubject
            .pipe(debounceTime(500))
            .subscribe(async app => {
                await this.appService.update(app);
                this.navigation.refresh();
            });
    }

    async deleteDashboard(application, dashboards: DashboardConfig[],index: number) {
        dashboards.splice(index, 1);
        application.applicationBuilder.dashboards = [...dashboards];
        await this.appService.update({
            id: application.id,
            applicationBuilder: application.applicationBuilder
        } as any);

        this.navigation.refresh();
    }

    async reorderDashboards(app, newDashboardsOrder) {
        app.applicationBuilder.dashboards = newDashboardsOrder;

        this.delayedAppUpdateSubject.next({
            id: app.id,
            applicationBuilder: app.applicationBuilder
        });
    }

    async saveAppChanges(app) {
        app.name = this.newAppName;
        app.applicationBuilder.icon = this.newAppIcon;
        app.icon = {
            name: this.newAppIcon,
            "class": `fa fa-${this.newAppIcon}`
        };
        await this.appService.update({
            id: app.id,
            name: app.name,
            key: `application-builder-${app.name}-app-key`,
            applicationBuilder: app.applicationBuilder,
            icon: app.icon
        } as any);

        // Refresh the application name/icon
        this.brandingService.updateStyleForApp(app);
        // Refresh the applications list
        this.appStateService.currentUser.next(this.appStateService.currentUser.value);
    }

    showCreateDashboardDialog(app) {
        this.bsModalRef = this.modalService.show(NewDashboardModalComponent, { class: 'c8y-wizard', initialState: { app } });
    }

    showEditDashboardDialog(app, dashboards: DashboardConfig[],index: number) {
        const dashboard = dashboards[index];
        this.bsModalRef = this.modalService.show(EditDashboardModalComponent, { class: 'c8y-wizard', initialState: { app, index, dashboardName: dashboard.name, dashboardIcon: dashboard.icon, deviceId: dashboard.deviceId } });
    }

    ngOnDestroy(): void {
        this.delayedAppUpdateSubscription.unsubscribe();
    }
}