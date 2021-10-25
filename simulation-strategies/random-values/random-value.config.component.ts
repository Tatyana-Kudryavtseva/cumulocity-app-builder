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

export interface RandomValueSimulationStrategyConfig extends OperationSupport<RandomValueSimulationStrategyConfig> {
    deviceId: string,
    fragment: string,
    series: string,
    minValue: number,
    maxValue: number,
    unit: string,
    interval: number;
}

@Component({
    template: `
        <div class="form-group">
            <label for="fragment"><span>Fragment</span></label>
            <input type="text" class="form-control" id="fragment" name="fragment" placeholder="e.g. temperature_measurement (required)" required autofocus [(ngModel)]="config.fragment">
        </div>
        <div class="form-group">
            <label for="series"><span>Series</span></label>
            <input type="text" class="form-control" id="series" name="series" placeholder="e.g. T (required)" required autofocus [(ngModel)]="config.series">
        </div>
        <div class="form-group">
            <label for="minvalue"><span>Minimum Value</span></label>
            <input type="number" class="form-control" id="minvalue" name="minvalue" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(0).minValue">
        </div>
        <div class="form-group">
            <label for="maxvalue"><span>Maximum Value</span></label>
            <input type="number" class="form-control" id="maxvalue" name="maxvalue" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(0).maxValue">
        </div>
        <div class="form-group">
            <label class="c8y-checkbox">
                <input type="checkbox" (click)="newOperation('rand_value',config.operations.length)" />
                <span></span>
                <span>Controlled by operation</span>
            </label>
        </div>

        <ng-container *ngIf="config.operations.length > 1">
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
                                <device-selector id="opSource" name="opSource" [(value)]="config.opSourceName" [placeHolder]="'Type your Device Name'" [required]="true" (selectedDevice)= "getSelectedDevice($event)"></device-selector>
                            </div>
                            <div class="col-lg-6 op-field">
                                <label for="opPayload"><span>Payload Key</span></label>
                                <input type="text" class="form-control" id="opPayload" name="opPayload" placeholder="e.g. c8y_command.text" required autofocus [(ngModel)]="config.payloadFragment">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 op-field">
                                <label class="c8y-checkbox">
                                    <input type="checkbox" id="opReply" name="opReply" [(ngModel)]="config.opReply" />
                                    <span></span>
                                    <span>Mark operation handled</span>
                                </label>
                            </div>
                        </div>
                        <hr /> 
                        <div class="row" *ngFor="let op of config.operations; let i = index">
                            <ng-container *ngIf="i > 0">
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 op-field">
                                            <label for="opMatch_{{i}}"><span>Matching</span></label>
                                            <input type="text" class="form-control" id="opMatch_{{i}}" name="opMatch_{{i}}" placeholder="e.g. WINDY" required [(ngModel)]="config.operations[i].matchingValue">
                                        </div>
                                        <div class="col-lg-6 op-field">
                                            <label for="minvalue_{{i}}"><span>Minimum Value</span></label>
                                            <input type="number" class="form-control" id="minvalue_{{i}}" name="minvalue_{{i}}" placeholder="e.g. 10 (required)" required [(ngModel)]="getOperationConfig(i).minValue">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6" op-field>
                                            <label for="maxvalue_{{i}}"><span>Maximum Value</span></label>
                                            <input type="number" class="form-control" id="maxvalue_{{i}}" name="maxvalue_{{i}}" placeholder="e.g. 20 (required)" required [(ngModel)]="getOperationConfig(i).maxValue">
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
                        <button class="btn btn-link btn-block" type="button" (click)="newOperation('rand_value',config.operations.length)">
                            <div class="pull-left float-left">Add condition</div>
                        </button>
                    </accordion-group>
                </accordion>
            </div>
        </ng-container>
        <div class="form-group">
            <label for="unit"><span>Unit</span></label>
            <input type="text" class="form-control" id="unit" name="unit" placeholder="e.g. C (optional)" [(ngModel)]="config.unit">
        </div> 
         <div class="form-group">
            <label for="interval"><span>Interval (seconds)</span></label>
            <input type="number" class="form-control" id="interval" name="interval" placeholder="e.g. 5 (required)" required [(ngModel)]="config.interval">
        </div>
    `,
    styles: [`
    :host >>> .panel.op-simulator-panel .panel-title {
         width: 100%;
    }
    .op-field {
        margin-bottom: 10px;
    }
    `],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class RandomValueSimulationStrategyConfigComponent extends SimulationStrategyConfigComponent {

    config: RandomValueSimulationStrategyConfig;

    getOperationConfig(i: number) : RandomValueSimulationStrategyConfig {
        let c: RandomValueSimulationStrategyConfig = this.getConfigAsAny(i);
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
        let c: RandomValueSimulationStrategyConfig = {
            deviceId: "",
            opSource: "",
            opSourceName: "",
            matchingValue: `${base}_match_${index}`,
            payloadFragment:  "c8y_Command.text",
            opReply: false,
            fragment: "temperature_measurement",
            series: `${base}_series_${index}`,
            minValue: 10,
            maxValue: 20,
            unit: "C",
            interval: 5,
            operations: undefined
        };

        this.config.operations.push(c);
        console.log(this.config.operations);
    }

    initializeConfig() {
        let c: RandomValueSimulationStrategyConfig = {
            deviceId: "",
            opSource: "",
            opSourceName: "",
            matchingValue: "default",
            payloadFragment:  "c8y_Command.text",
            opReply: false,
            fragment: "temperature_measurement",
            series: "T",
            minValue: 10,
            maxValue: 20,
            unit: "C",
            interval: 5,
            operations: new Array()
        };

        //New objects can duplicate the default so it can be restored
        //we will create the config entries if old simulators are edited
        //duplication is to avoid changing old code.
        this.config = _.cloneDeep(c);
        this.config.operations.push(c);
    }

}
