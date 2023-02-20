import { CustomerService } from './services/customer.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AddModelComponent } from './components/add-model/add-model.component';
import { Customer } from './models/customer';
import { ProductModel } from './models/product-model';
import { Product } from './models/product';
import { ProductService } from './services/product.service';

export interface category {
  id: number;
  name_ar: string;
  pieces: string;
  barcode: string;
  quantity: string;
  total: string;
  price: string;
}

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements AfterViewInit, OnInit {
  displayedColumns = ['name', 'quantity', 'add'];
  displayedColumns2 = [
    'name',
    'pieces',
    'price',
    'quantity',
    'total',
    'delete',
  ];
  displayedColumns3 = ['name', 'description', 'attachment', 'model', 'delete'];
  customers: Customer[] = [];
  models: ProductModel[] = [];
  productDataSource!: MatTableDataSource<Product>;
  dataSource2!: MatTableDataSource<category>;
  modelDataSource!: MatTableDataSource<ProductModel>;
  category: category[] = [];
  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
    this.productService.getProducts().subscribe((products) => {
      this.productDataSource = new MatTableDataSource(products);
    });
  }

  categoryFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  productFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim();

    if (this.productDataSource.paginator) {
      this.productDataSource.paginator.firstPage();
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
    this.dialog
      .open(AddModelComponent, {
        disableClose: true,
        width: '500px',
        height: '520px',
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          result.modelData.id = this.models.length + 1;
          this.models.push(result.modelData);
        },
        complete: () => {
          this.modelDataSource = new MatTableDataSource(this.models);

          // this.modelDataSource._updateChangeSubscription();
        },
      });
  }
  deleteProduct(id: number) {
    const elementIndex = this.models.findIndex((model) => model.id == id);
    this.models.splice(elementIndex, 1);

    this.modelDataSource._updateChangeSubscription();
  }
  deleteCategory(id: number) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == id
    );
    this.category.splice(elementIndex, 1);

    this.dataSource2._updateChangeSubscription();
  }
  add(data: any) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == data.id
    );
    if (elementIndex != -1) {
      this.category[elementIndex].quantity = (
        parseInt(this.category[elementIndex].quantity) + 1
      ).toString();
    } else {
      data.quantity = '1';
      this.category.push(data);
    }
    this.dataSource2 = new MatTableDataSource(this.category);
  }
}
