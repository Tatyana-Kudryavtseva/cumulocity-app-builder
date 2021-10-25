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

import { Component } from "@angular/core";
import { ControlContainer, NgForm } from '@angular/forms';
import { OperationDefinitions, OperationSupport } from "builder/simulator/simulator-config";
import { SimulationStrategyConfigComponent } from "../../builder/simulator/simulation-strategy";
import * as _ from 'lodash';

export interface DtdlSimulationStrategyConfig extends OperationSupport<DtdlSimulationStrategyConfig> {
    deviceId: string,
    modalSize?: string,
    deviceName: string,
    dtdlDeviceId: string,
    dtdlModelConfig: DtdlSimulationModel[],
    interval: number,
    isEditMode?: boolean;
}

export interface DtdlSimulationModel {
    measurementName?: string,
    fragment?: string,
    series?: string,
    unit?: string,
    schema?: any,
    id?: string,
    minValue?: number, // random value, random walk
    maxValue?: number, // random value, random walk
    value?: string, // value series
    startingValue?: number, // random walk
    maxDelta?: number, // random walk
    latitude?: string, // position update
    longitude?: string, // position update
    altitude?: string, // position update
    deviceId?: string;
    simulationType?: string;
    isObjectType?: boolean;
    parentId?: string;
    isFieldModel?: boolean;
    eventType?: string; // event creation
    eventText?: string; // event creation
}
@Component({
    template: `
    
        <div class="row" *ngIf="!config.isEditMode">
            <div class="col-xs-12 col-sm-6 col-md-6">
                <div class="form-group">
                    <label for="dtdlFile"><span>Upload a DTDL File</span></label>
                    <div style="display: inline-flex;">
                     <input type="file" class="form-control" id="dtdlFile" name="dtdlFile" (change)="fileUploaded($event)" accept=".json">
                     <div *ngIf="isUploading" style="color:blue;margin: 5px;"><i class="fa fa-circle-o-notch fa-spin"></i></div>
                    </div>
                    <div *ngIf="isError" style="color:red;">Invalid DTDL File!</div>
                </div>
                
            </div>
             <div class="col-xs-12 col-sm-6 col-md-6">
             <div class="form-group">
                <label for="name"><span>Name</span></label>
                <input type="text" class="form-control" id="name" name="name" placeholder="e.g. My First Simulator (required)" required autofocus [(ngModel)]="getOperationConfig(0).deviceName">
             </div>
            </div>
            
        </div>
        <div class="form-group"  *ngIf="!config.isEditMode">
             <label for="dtdlDevice"><span>Select Measurements</span></label>
             <ng-select [items]="configModel" bindLabel="measurementName" name="measurementSelect" required [multiple]="true" [closeOnSelect]="false" [searchable]="true"
             placeholder="Select Measurements" [(ngModel)]="config.dtdlModelConfig" >
             </ng-select>
        </div>
        
        <div class="form-group">
            <accordion  [isAnimated]="true" [closeOthers]="true">
                <accordion-group panelClass="dtdl-simulator-measurement-panel"  *ngFor="let model of getOperationConfig(0).dtdlModelConfig;let index = index"  #dtdlGroup>
                    <button class="btn btn-link btn-block clearfix" accordion-heading type="button">
                        <div class="pull-left float-left">{{model.measurementName}}</div>
                        <span class="float-right pull-right"><i *ngIf="dtdlGroup.isOpen" class="fa fa-caret-up"></i>
                        <i *ngIf="!dtdlGroup.isOpen" class="fa fa-caret-down"></i></span>
                    </button>
                    <div class="col-xs-12 col-sm-4 col-md-4">
                        <div class="measurement-accordion">
                            <label for="simulationType"><span>Simulation Type</span></label>
                            <select name="simulationType{{model.id}}"  [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].simulationType" required >
                                <option value="randomValue" >Random Value</option>
                                <option value="valueSeries" >Value Series</option>
                                <option value="randomWalk" >Random Walk</option>
                                <option value="positionUpdate" >Position Update</option>
                                <option value="eventCreation" >Event Creation</option>
                            </select>
                        </div>     
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4" *ngIf="!getOperationConfig(0).dtdlModelConfig[index].isFieldModel && getOperationConfig(0).dtdlModelConfig[index].simulationType !== 'positionUpdate' && getOperationConfig(0).dtdlModelConfig[index].simulationType !== 'eventCreation'">
                    <div class="measurement-accordion">
                        <label for="fragment"><span>Fragment</span></label>
                        <input type="text" class="form-control"  name="fragment{{model.id}}" placeholder="e.g. temperature_measurement (required)" required autofocus [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].fragment">
                    </div>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4" *ngIf="getOperationConfig(0).dtdlModelConfig[index].simulationType !== 'positionUpdate' && getOperationConfig(0).dtdlModelConfig[index].simulationType !== 'eventCreation'">
                        <div class="measurement-accordion">
                            <label for="series"><span>Series</span></label>
                            <input type="text" class="form-control" name="series{{model.id}}" placeholder="e.g. T (required)" required autofocus [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].series">
                        </div>
                    </div>
                    <ng-container [ngSwitch]="getOperationConfig(0).dtdlModelConfig[index].simulationType">
                                <ng-container *ngSwitchCase="'randomValue'">
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="minvalue"><span>Minimum Value</span></label>
                                            <input type="number" class="form-control"  name="minvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].minValue">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="maxvalue"><span>Maximum Value</span></label>
                                            <input type="number" class="form-control"  name="maxvalue{{model.id}}" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].maxValue">
                                        </div>
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchCase="'positionUpdate'">
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="latitude"><span>Latitude Value</span></label>
                                            <input type="text" class="form-control"  name="latitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].latitude">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="altitude"><span>Altitude Value</span></label>
                                            <input type="text" class="form-control"  name="altitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].altitude">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="longitude"><span>Longitude value</span></label>
                                            <input type="text" class="form-control"  name="longitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].longitude">
                                        </div>
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchCase="'eventCreation'">
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="eventType"><span>Event Type</span></label>
                                            <input type="text" class="form-control"  name="eventType{{model.id}}" placeholder="c8y_locationUpdate,c8y_BeaconUpdate" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].eventType">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="eventText"><span>Event Text</span></label>
                                            <input type="text" class="form-control"  name="eventText{{model.id}}" placeholder="c8y_locationUpdate,c8y_BeaconUpdate (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].eventText">
                                        </div>
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchCase="'valueSeries'">
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="value"><span>Value</span></label>
                                            <input type="text" class="form-control" id="value" name="value{{model.id}}" placeholder="e.g. 15,20,30 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].value">
                                        </div> 
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchCase="'randomWalk'">
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                        <label for="startingvalue"><span>Starting Value</span></label>
                                        <input type="number" class="form-control" id="startingvalue" name="startingvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].startingValue">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="maxdelta"><span>Maximum Change Amount</span></label>
                                            <input type="number" class="form-control" id="maxdelta" name="maxdelta{{model.id}}" min="0" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].maxDelta">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="minvalue"><span>Minimum Value</span></label>
                                            <input type="number" class="form-control"  name="minvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].minValue">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 col-md-4">
                                        <div class="measurement-accordion">
                                            <label for="maxvalue"><span>Maximum Value</span></label>
                                            <input type="number" class="form-control"  name="maxvalue{{model.id}}" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(0).dtdlModelConfig[index].maxValue">
                                        </div>
                                    </div>
                                </ng-container>
                            </ng-container>

                    <!-- multiple possible configs here -->
                    <div class="form-group">
                        <label class="c8y-checkbox">
                            <input type="checkbox" [(ngModel)]="getOperationConfig(0).opEnabled"/>
                            <span></span>
                            <span>Controlled by operation</span>
                        </label>
                    </div>

                    <!-- start fields --> 
                    <ng-container *ngIf="getOperationConfig(0).opEnabled">
                        <div class="form-group">
                            <accordion  [isAnimated]="true" [closeOthers]="true">
                                <accordion-group panelClass="op-simulator-panel" #opGroup>
                                    <button class="btn btn-link btn-block clearfix" accordion-heading type="button">
                                        <div class="pull-left float-left">Operation details</div>
                                        <span class="float-right pull-right"><i *ngIf="opGroup.isOpen" class="fa fa-caret-up"></i>
                                        <i *ngIf="!opGroup.isOpen" class="fa fa-caret-down"></i></span>
                                    </button>
                                    <div class="row">
                                        <div class="col-lg-6 op-field">
                                            <label for="opSource"><span>Operation Source</span></label>
                                            <device-selector id="opSource" name="opSource" [(value)]="getOperationConfig(0).opSourceName" [placeHolder]="'Type your Device Name'" [required]="true" (selectedDevice)= "getSelectedDevice($event)"></device-selector>
                                        </div>
                                        <div class="col-lg-6 op-field">
                                            <label for="opPayload"><span>Payload Key</span></label>
                                            <input type="text" class="form-control" id="opPayload" name="opPayload" placeholder="e.g. c8y_command.text" required autofocus [(ngModel)]="getOperationConfig(0).payloadFragment">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 op-field">
                                            <label class="c8y-checkbox">
                                                <input type="checkbox" id="opReply" name="opReply" [(ngModel)]="getOperationConfig(0).opReply" />
                                                <span></span>
                                                <span>Mark operation handled</span>
                                            </label>
                                        </div>
                                    </div>
                                    <hr /> 
                                    <div class="row" *ngFor="let op of getOperationConfig(0).operations; let i = index">
                                        <ng-container *ngIf="i > 0">
                                            <div class="col-lg-12">
                                                <div class="row">
                                                    <div class="col-lg-6 op-field">
                                                        <label for="opMatch_{{i}}"><span>Matching</span></label>
                                                        <input type="text" class="form-control" id="opMatch_{{i}}" name="opMatch_{{i}}" placeholder="e.g. WINDY" required [(ngModel)]="getOperationConfig(i).matchingValue">
                                                    </div>
                                                    <div class="col-lg-6 op-field">
                                                        <label for="opValue_{{i}}"><span>Values</span></label>
                                                        <!-- <input type="text" class="form-control" id="opValue_{{i}}" name="opValue_{{i}}" placeholder="e.g. 15,20,30 (required)" required [(ngModel)]="getOperationConfig(i).value"> -->
                                                        <!-- dtdl field handling --> 
                                                        <ng-container [ngSwitch]="config.dtdlModelConfig[index].simulationType">
                                                            <ng-container *ngSwitchCase="'randomValue'">
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="minvalue"><span>Minimum Value</span></label>
                                                                        <input type="number" class="form-control"  name="minvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="config.dtdlModelConfig[index].minValue">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="maxvalue"><span>Maximum Value</span></label>
                                                                        <input type="number" class="form-control"  name="maxvalue{{model.id}}" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].maxValue">
                                                                    </div>
                                                                </div>
                                                            </ng-container>
                                                            <ng-container *ngSwitchCase="'positionUpdate'">
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="latitude"><span>Latitude Value</span></label>
                                                                        <input type="text" class="form-control"  name="latitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].latitude">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="altitude"><span>Altitude Value</span></label>
                                                                        <input type="text" class="form-control"  name="altitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].altitude">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="longitude"><span>Longitude value</span></label>
                                                                        <input type="text" class="form-control"  name="longitude{{model.id}}" placeholder="e.g. 40.66,50.40 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].longitude">
                                                                    </div>
                                                                </div>
                                                            </ng-container>
                                                            <ng-container *ngSwitchCase="'eventCreation'">
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="eventType"><span>Event Type</span></label>
                                                                        <input type="text" class="form-control"  name="eventType{{model.id}}" placeholder="c8y_locationUpdate,c8y_BeaconUpdate" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].eventType">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="eventText"><span>Event Text</span></label>
                                                                        <input type="text" class="form-control"  name="eventText{{model.id}}" placeholder="c8y_locationUpdate,c8y_BeaconUpdate (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].eventText">
                                                                    </div>
                                                                </div>
                                                            </ng-container>
                                                            <ng-container *ngSwitchCase="'valueSeries'">
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="value"><span>Value</span></label>
                                                                        <input type="text" class="form-control" id="value" name="value{{model.id}}" placeholder="e.g. 15,20,30 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].value">
                                                                    </div> 
                                                                </div>
                                                            </ng-container>
                                                            <ng-container *ngSwitchCase="'randomWalk'">
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                    <label for="startingvalue"><span>Starting Value</span></label>
                                                                    <input type="number" class="form-control" id="startingvalue" name="startingvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].startingValue">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="maxdelta"><span>Maximum Change Amount</span></label>
                                                                        <input type="number" class="form-control" id="maxdelta" name="maxdelta{{model.id}}" min="0" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].maxDelta">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="minvalue"><span>Minimum Value</span></label>
                                                                        <input type="number" class="form-control"  name="minvalue{{model.id}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].minValue">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xs-12 col-sm-4 col-md-4">
                                                                    <div class="measurement-accordion">
                                                                        <label for="maxvalue"><span>Maximum Value</span></label>
                                                                        <input type="number" class="form-control"  name="maxvalue{{model.id}}" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(i).dtdlModelConfig[index].maxValue">
                                                                    </div>
                                                                </div>
                                                            </ng-container>
                                                        </ng-container>
                                                        <!-- dtdl field handling --> 
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-lg-6 op-field">
                                                        <button class="btn btn-link btn-block" type="button" (click)="deleteOperation(i)">
                                                            <div class="pull-left float-left">Remove condition</div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />          
                                        </ng-container>
                                    </div>
                                    <button class="btn btn-link btn-block" type="button" (click)="newOperation('dtdl{{model.id}}_value',config.operations.length)">
                                        <div class="pull-left float-left">Add condition</div>
                                    </button>
                                </accordion-group>
                            </accordion>
                        </div>
                    </ng-container>
                    <!-- end fields --> 

                    <div class="form-group">
                        <button class="btn btn-link btn-block" type="button" (click)='newOperation("rand_value",config.operations.length)'>
                                <div class="pull-left float-left">add operation</div>
                            </button>
                    </div>

                    <!-- finish multiple configs --> 





                    <div class="col-xs-12 col-sm-4 col-md-4" *ngIf="config.dtdlModelConfig[index].simulationType !== 'positionUpdate' && config.dtdlModelConfig[index].simulationType !== 'eventCreation'">
                        <div class="measurement-accordion">
                            <label for="unit"><span>Unit</span></label>
                            <input type="text" class="form-control"  name="unit{{model.id}}" placeholder="e.g. C (optional)" [(ngModel)]="config.dtdlModelConfig[index].unit">
                        </div>        
                    </div>
                </accordion-group>
            </accordion>
        </div>
        <div class="form-group">
            <label for="interval"><span>Interval (seconds)</span></label>
            <input type="number" class="form-control" id="interval" name="interval" placeholder="e.g. 5 (required)" required [(ngModel)]="config.interval">
        </div>
    `,
    styles: [`
    :host >>> .panel.dtdl-simulator-measurement-panel .panel-title{
         width: 100%;
     }

     .measurement-accordion {
        padding-bottom: 10px;
     }
     .measurement-accordion label {
        font-size: 12px;
    }
    .measurement-accordion input, .measurement-accordion select {
        font-size: 12px;
        height: 24px;
    }

    `],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DtdlSimulationStrategyConfigComponent extends SimulationStrategyConfigComponent {
    config: DtdlSimulationStrategyConfig;
    configModel: DtdlSimulationModel[] = [];
    dtdlFile: FileList;
    isUploading = false;
    isError = false;


    getOperationConfig(i: number) : DtdlSimulationStrategyConfig {
        let c: DtdlSimulationStrategyConfig = this.getConfigAsAny(i);
        if( c != undefined) {
            return c;
        } 
        return this.config;
    }

    getSelectedDevice(device: any) {
        this.config.opSource = device.id;
        this.config.opSourceName = device.name;
    }

    newOperation(base: string, index: number ) {
        //        series: `${base}_series_${index}`,
        let c: DtdlSimulationStrategyConfig = {
            deviceId: "",
            opSource: "",
            opSourceName: "",
            matchingValue: `${base}_match_${index}`,
            payloadFragment:  "c8y_Command.text",
            opReply: false,
            modalSize: "modal-md",
            deviceName: "",
            dtdlModelConfig: [],
            dtdlDeviceId: "",
            interval: 5,
            operations: new Array()
        };

        //New objects can duplicate the default so it can be restored
        //we will create the config entries if old simulators are edited
        //duplication is to avoid changing old code.
        this.config.operations.push(c);
        console.log(this.config.operations);
    }

    initializeConfig() {

        this.configModel = [];
        let c: DtdlSimulationStrategyConfig = {
            deviceId: "",
            opSource: "",
            opSourceName: "",
            matchingValue: "default",
            payloadFragment:  "c8y_Command.text",
            opReply: false,
            modalSize: "modal-md",
            deviceName: "",
            dtdlModelConfig: [],
            dtdlDeviceId: "",
            interval: 5,
            operations: new Array()
        };

        //New objects can duplicate the default so it can be restored
        //we will create the config entries if old simulators are edited
        //duplication is to avoid changing old code.
        this.config = _.cloneDeep(c);
        this.config.operations.push(c);
    }


    fileUploaded(events) {
        this.isError = false;
        this.isUploading = true;
        const file = events.target.files[0];
        const reader = new FileReader();
        let input = null;
        reader.addEventListener('load', (event: any) => {
            input = event.target.result;
            const validJson = this.isValidJson(input);
            if (validJson) {
                this.dtdlFile = validJson;
                this.processDTDL(validJson);
            } else {
                this.isError = true;
                events.srcElement.value = "";
            }
            this.isUploading = false;
        });
        if (file) { reader.readAsText(file); }
        else { this.isUploading = false; }
    }

    /**
     *
     * @param input Validate JSON Input
     */
    private isValidJson(input: any) {
        try {
            if (input) {
                const o = JSON.parse(input);
                if (o && (o.constructor === Object || o.constructor === Array)) {
                    return o;
                }
            }
        } catch (e) { }
        return false;
    }


    private processDTDL(dtdl: any) {
        this.initializeConfig();
        if (dtdl.constructor === Object) {
            this.config.deviceName = (dtdl.displayName && dtdl.displayName.constructor === Object ? dtdl.displayName.en : dtdl.displayName);
            this.processDTDLMeasurement(dtdl.contents);
        } else {
            dtdl.forEach((device, idx) => {
                if (idx === 0) {
                    this.config.deviceName = (device.displayName && device.displayName.constructor === Object ? device.displayName.en : device.displayName);
                }
                this.processDTDLMeasurement(device.contents);
            });
        }
    }
    private processDTDLMeasurement(dtdlM: any, deviceId?: string) {
        if (dtdlM && dtdlM.length > 0) {
            dtdlM.forEach((content: any) => {
                if (content['@type'].includes("Telemetry")) {
                    this.processTelemetry(content, deviceId);
                } else if (content['@type'].includes("Component")) {
                    const schemaContent = (content.schema && content.schema.contents ? content.schema.contents : []);
                    schemaContent.forEach((content: any) => {
                        if (content['@type'].includes("Telemetry")) {
                            this.processTelemetry(content, deviceId);
                        }
                    });
                }
            });
        }
    }

    private processTelemetry(content: any, deviceId?: string) {
        const typeLength = (Array.isArray(content['@type']) ? content['@type'].length : 0);
        const model: DtdlSimulationModel = {
            simulationType: 'randomValue'
        };
        model.measurementName = (content.displayName && content.displayName.constructor === Object ? content.displayName.en : content.displayName);
        model.fragment = (typeLength > 0 ? content['@type'][typeLength - 1] : content['@type']);
        model.id = (content['@id'] ? content['@id'] : Math.floor(Math.random() * 1000000));
        model.schema = content.schema;
        model.series = content.name;
        model.unit = content.unit;
        model.deviceId = deviceId;
        model.eventText = model.measurementName;
        model.eventType = content.name;
        model.isObjectType = (model.schema['@type'] === 'Object');
        if (model.isObjectType && model.schema.fields) {
            const fields = model.schema.fields;
            if (fields && fields.length > 0) {
                fields.forEach(field => {
                    const fieldModel: DtdlSimulationModel = {
                        simulationType: 'randomValue'
                    };
                    fieldModel.measurementName = model.measurementName + " : " + field.displayName;
                    fieldModel.fragment = model.fragment;
                    fieldModel.id = (field['@id'] ? field['@id'] : Math.floor(Math.random() * 1000000));
                    fieldModel.schema = field.schema;
                    fieldModel.series = content.name + ":" + field.name;
                    fieldModel.unit = field.unit;
                    fieldModel.deviceId = deviceId;
                    fieldModel.isObjectType = false;
                    fieldModel.isFieldModel = true;
                    fieldModel.parentId = model.id;
                    fieldModel.eventText = fieldModel.measurementName;
                    fieldModel.eventType = field.name;
                    this.configModel.push(fieldModel);
                });
            }
        } else {
            this.configModel.push(model);
        }

    }
}
