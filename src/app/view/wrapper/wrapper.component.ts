import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, map, max } from 'rxjs/operators';
import { Employee } from 'src/app/models/employee.model';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],

})

export class WrapperComponent implements OnInit {
  employees: Employee[] = [];
  employeesMaster: Employee[] = [];
  ageGroups: any[] = [];
  @ViewChild('search') search: ElementRef<HTMLInputElement> = {} as ElementRef;;

  constructor(
    private employeeService: EmployeeService,
    private searchPipe: SearchPipe
    ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  /** Get list of employees */
  getEmployees() {
    this.employeeService.getEmployees()
      .pipe(
        map(res => {
          this.employeesMaster = res.data;
          this.employees = res.data;
          this.createAgeGroup();
        }),
        catchError((err) => {
          this.employeesMaster = [];
          this.employees = [];
          throw err;
        })
      )
      .subscribe()
  }

  /** Sort list based on employees salary */
  sort(type: 'ASC' | 'DESC') {
    if (type === 'ASC') {
      this.employees = [...this.employees].sort((a, b) => a.employee_salary - b.employee_salary);
    }
    if (type === 'DESC') {
      this.employees = [...this.employees].sort((a, b) => b.employee_salary - a.employee_salary);
    }
  }

  /** Create age groups considering the oldest employee */
  createAgeGroup() {
    const oldestEmployee = Math.max(...this.employees.map(e => e.employee_age));
    console.log({ oldestEmployee })

    const GROUP_SIZE = 20;
    let minAge = 0;
    let maxAge = minAge + GROUP_SIZE;
    do {
      const group = {
        min: minAge,
        max: maxAge,
        value: `[${minAge} - ${maxAge}]`,
      }
      this.ageGroups.push(group);
      minAge = maxAge;
      maxAge = minAge + GROUP_SIZE;
    }

    while (minAge <= oldestEmployee && oldestEmployee <= maxAge);

    console.log(this.ageGroups)
  }

  /** Search by Employee Name */
  searchEmployee(event: HTMLInputElement) {
    console.log(event.value)
    this.employees = [...this.searchPipe.transform(this.employeesMaster, event.value.trim())];
  }

  resetFilter() {
    this.employees = [...this.employeesMaster];
    this.search.nativeElement.value = '';
  }
}
