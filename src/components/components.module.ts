import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkeltonItemComponent } from './skelton-item/skelton-item';
@NgModule({
	declarations: [SkeltonItemComponent],
	imports: [CommonModule],
	exports: [SkeltonItemComponent]
})
export class ComponentsModule {}
