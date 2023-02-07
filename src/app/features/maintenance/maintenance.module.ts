import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AddModelComponent } from './components/add-model/add-model.component';
import { AddNewModelComponent } from './components/add-new-model/add-new-model.component';

@NgModule({
  declarations: [MaintenanceComponent, AddAgentComponent, AddModelComponent, AddNewModelComponent],
  imports: [CommonModule, MaintenanceRoutingModule, MaterialModule],
})
export class MaintenanceModule {}
