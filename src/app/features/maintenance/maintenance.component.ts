import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AddModelComponent } from './components/add-model/add-model.component';

export interface UserData {
  id: string;
  name: string;
  pieces: string;
  charge: string;
  price: string;
}
export interface category {
  id: string;
  name: string;
  pieces: string;
  barcode: string;
  quantity: string;
  total: string;
  price: string;
}
export interface Models {
  id: string;
  name: string;
  description: string;
  attache: string;
}
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'pieces',
    'charge',
    'price',
    'add',
  ];
  displayedColumns2: string[] = [
    'id',
    'name',
    'pieces',
    'barcode',
    'price',
    'quantity',
    'total',
    'delete',
  ];
  displayedColumns3: string[] = [
    'id',
    'name',
    'description',
    'attache',
    'delete',
  ];

  dataSource: MatTableDataSource<UserData>;
  dataSource2: MatTableDataSource<category>;
  dataSource3: MatTableDataSource<Models>;

  @ViewChild('paginator1') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  @ViewChild('MatSort1') sort!: MatSort;
  @ViewChild('MatSort2') sort2!: MatSort;
  @ViewChild('MatSort3') sort3!: MatSort;

  constructor(private dialog: MatDialog) {
    const users: UserData[] = [
      {
        id: '1',
        name: 'islam',
        pieces: '1',
        charge: '1',
        price: '1',
      },
      {
        id: '2',
        name: 'ahmed',
        pieces: '1',
        charge: '1',
        price: '1',
      },
      {
        id: '3',
        name: 'mohamed',
        pieces: '1',
        charge: '1',
        price: '1',
      },
      {
        id: '4',
        name: 'said',
        pieces: '1',
        charge: '1',
        price: '1',
      },
      {
        id: '5',
        name: 'ali',
        pieces: '1',
        charge: '1',
        price: '1',
      },
    ];
    const category: category[] = [
      {
        id: '1',
        name: 'Hydrogen',
        pieces: '1',
        barcode: '1',
        quantity: '1',
        total: '1',
        price: '1',
      },
      {
        id: '2',
        name: 'Helium',
        pieces: '1',
        barcode: '1',
        quantity: '1',
        total: '1',
        price: '1',
      },
      {
        id: '3',
        name: 'Helium',
        pieces: '1',
        barcode: '1',
        quantity: '1',
        total: '1',
        price: '1',
      },
      {
        id: '4',
        name: 'Helium',
        pieces: '1',
        barcode: '1',
        quantity: '1',
        total: '1',
        price: '1',
      },
      {
        id: '5',
        name: 'Helium',
        pieces: '1',
        barcode: '1',
        quantity: '1',
        total: '1',
        price: '1',
      },
    ];
    const models: Models[] = [
      {
        id: '1',
        name: 'Hydrogen',
        description: '1',
        attache: '1',
      },
      {
        id: '2',
        name: 'Helium',
        description: '1',
        attache: '1',
      },
      {
        id: '3',
        name: 'Hydrogen',
        description: '1',
        attache: '1',
      },
      {
        id: '4',
        name: 'Helium',
        description: '1',
        attache: '1',
      },
      {
        id: '5',
        name: 'Helium',
        description: '1',
        attache: '1',
      },
    ];
    this.dataSource = new MatTableDataSource(users);
    this.dataSource2 = new MatTableDataSource(category);
    this.dataSource3 = new MatTableDataSource(models);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource3.paginator = this.paginator3;
    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort2;
    this.dataSource3.sort = this.sort3;
  }

  categoryFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  modelsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }
  addAgent() {
    this.dialog.open(AddAgentComponent, {
      disableClose: true,
      width: '400px',
      height: '300px',
    });
  }
  addModel() {
    this.dialog.open(AddModelComponent, {
      disableClose: true,
      width: '500px',
      height: '520px',
    });
  }
}
