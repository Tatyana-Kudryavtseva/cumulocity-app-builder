import { Injectable } from '@angular/core';
import { ApplicationService, InventoryService, ICurrentTenant, IApplication } from '@c8y/client';
import { AlertService } from '@c8y/ngx-components';
import { contextPathFromURL } from '../utils/contextPathFromURL';
import {UpdateableAlert} from "../utils/UpdateableAlert";

@Injectable({providedIn: 'root'})
export class SettingsService {
    constructor(private appService: ApplicationService, private inventoryService: InventoryService,
        private alertService: AlertService ){}

    isAnalyticsProviderLoaded = false;

    private appBuilderConfig: any;
    private appbuilderId: any = '';
    private defaultCustomProperties = {
        gainsightEnabled: ""
    };
    private currentTenant: ICurrentTenant;
    
    analyticsProvider = {
        providerURL : 'https://web-sdk.aptrinsic.com/api/aptrinsic.js', 
        providerKey : 'AP-98W68BOG3KCQ-2', 
        providerIdentity: 'demo@democenter.com',
        providerAccountId : 'Application Builder', 
        providerAccountName: 'Application Builder'
    }

    async getAPPBuilderId() {
        if(this.appbuilderId) { return this.appbuilderId; }
        else {
            const appList = (await this.appService.list({pageSize: 2000})).data;
            let app: IApplication & {widgetContextPaths?: string[]} = appList.find(app => app.contextPath === contextPathFromURL() &&
             app.availability === 'PRIVATE');
            if (!app) {
                // Own App builder not found. Looking for subscribed one
                app = appList.find(app => app.contextPath === contextPathFromURL());
                if(!app) { throw Error('Could not find current application.');}
            } 
            if(app) { this.appbuilderId = app.id; }
            return this.appbuilderId;
        }
    }
    private async getAppBuilderConfig() {
        const appBuilderId = await this.getAPPBuilderId();
        const AppBuilderConfigList = (await this.inventoryService.list( {pageSize: 50, query: `type eq AppBuilder-Configuration and appBuilderId eq '${appBuilderId}'`})).data;
        this.appBuilderConfig = (AppBuilderConfigList.length > 0 ? AppBuilderConfigList[0] : null);
    }

    async getCustomProperties() {
        if(this.appBuilderConfig) 
            return (this.appBuilderConfig.customProperties ? this.appBuilderConfig.customProperties : this.defaultCustomProperties);
        else {
            await this.getAppBuilderConfig();
            return (this.appBuilderConfig && this.appBuilderConfig.customProperties ? this.appBuilderConfig.customProperties : this.defaultCustomProperties);
        }
    }
    
    async saveCustomProperties(customProperties) {
        const creationAlert = new UpdateableAlert(this.alertService);
        creationAlert.update('Adding new Provider...');
        const appBuilderId = await this.getAPPBuilderId();
        if(this.appBuilderConfig) {
            await this.inventoryService.update({
                id: this.appBuilderConfig.id,
                customProperties,
                c8y_Global: {}
            })
        } else  {
            await this.inventoryService.create({
                    c8y_Global: {},
                    type: "AppBuilder-Configuration",
                    customProperties,
                    appBuilderId
            });
        }
        creationAlert.update(`Custom Properties Updated!`, "success");
        creationAlert.close(5000);
        location.reload();
    }

    setTenant(tenant: ICurrentTenant | null) {
        this.currentTenant = tenant;
    }

    getTenantName() {
        return (this.currentTenant && this.currentTenant.name ? this.currentTenant.name : '');
    }

    isGaisigntEnabledFromParent() {
        if(this.currentTenant && this.currentTenant.customProperties && this.currentTenant.customProperties.gainsightEnabled) {
            return (this.currentTenant.customProperties.gainsightEnabled === 'true');
        }  
        return false;     
    }

    private async isAnalyticsProviderActive() {
        if(this.appBuilderConfig && this.appBuilderConfig.customProperties) {
            const customProperties = this.appBuilderConfig.customProperties;
            return (customProperties && customProperties.gainsightEnabled === 'true')
        }
        else {
            await this.getAppBuilderConfig();
            if(this.appBuilderConfig && this.appBuilderConfig.customProperties) {
                const customProperties = this.appBuilderConfig.customProperties;
                return (customProperties && customProperties.gainsightEnabled === 'true')
            }
            return false;
        }  
    }

    async loadAnalyticsProvider() {
        // if(this.isGaisigntEnabledFromParent() || this.isAnalyticsProviderLoaded) { return false;} //Required for 1009.x.x
        if(this.isAnalyticsProviderLoaded) { return false;}
        else {
            if(this.isGaisigntEnabledFromParent) { return true; }
            const isProviderActive =  await this.isAnalyticsProviderActive();
            return isProviderActive;
        }
    }

    getAnalyticsProvider() {
        return this.analyticsProvider;
    }
}