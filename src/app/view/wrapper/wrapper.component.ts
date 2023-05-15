import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
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
  selectedAgeRange = '0';
  search: string = '';
  // @ViewChild('search') search: ElementRef<HTMLInputElement> = {} as ElementRef;;

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
    const maxRange = oldestEmployee % 20 === 0 ? oldestEmployee / 20 : Math.floor(oldestEmployee / 20) + 1;
    for (let i = 0; i < maxRange; i++) {
      const startAge = i === 0 ? 0 : (i * GROUP_SIZE) + 1;
      const endAge = startAge === 0 ? startAge + GROUP_SIZE : (startAge + GROUP_SIZE) - 1;
      const range = `${startAge}-${endAge}`;
      this.ageGroups.push(range);
    }
  }

  /** Search by Employee Name */
  searchEmployee() {
    this.employees = [...this.searchPipe.transform(this.employeesMaster, this.search.trim())];
  }

  onChangeAge() {
    if (this.selectedAgeRange == '0') {
      this.employees = [...this.employeesMaster];
    } else {
      this.filterByAgeRange();
    }
  }

  filterByAgeRange() {
    const [minAge, maxAge] = this.selectedAgeRange.split('-');
    this.employees = this.employeesMaster.filter(e => e.employee_age >= Number(minAge) && e.employee_age <= Number(maxAge));
  }

  resetFilter() {
    this.employees = [...this.employeesMaster];
    // this.search.nativeElement.value = '';
    this.search = '';
    this.selectedAgeRange = '0';
  }
}
