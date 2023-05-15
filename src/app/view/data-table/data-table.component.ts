import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {

  @Input() data: Employee[] = [];

}
