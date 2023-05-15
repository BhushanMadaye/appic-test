import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  GET_EMPLOYEES_DUMMY = `assets/data.json`;
  GET_EMPLOYEES = `https://dummy.restapiexample.com/api/v1/employees`;

  getEmployees(): Observable<any> {
    return this.http.get(this.GET_EMPLOYEES_DUMMY);
  }
}
