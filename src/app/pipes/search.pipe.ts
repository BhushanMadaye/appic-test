import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(rows: Employee[], search: string = ''): Employee[] {

    if (!rows || !search) {
      return rows;
    }

    search = search.toLowerCase();
    const filteredData = rows.filter(item =>
      item.employee_name.toLowerCase().includes(search)
    );
    console.log(filteredData);
    return filteredData;
  }

}
