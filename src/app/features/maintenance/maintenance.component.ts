import { ProductPriceService } from './services/product-price.service';
import { Category } from './models/category';
import { CustomerService } from './services/customer.service';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AddModelComponent } from './components/add-model/add-model.component';
import { Customer } from './models/customer';
import { ProductModel } from './models/product-model';
import { Product, Api_prices } from './models/product';
import { ProductService } from './services/product.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements AfterViewInit, OnInit {
  invoiceForm = this.fb.group({
    customerName: [''],
    date: [''],
    paymentMethod: [''],
    paymentWay: [''],
    price: [''],
    vat: [''],
    total: [''],
    paid: [''],
    change: [''],
  });

  productColumns = ['name', 'quantity', 'add'];
  categoryColumns = ['name', 'pieces', 'price', 'quantity', 'total', 'delete'];
  modelsColumns = ['model', 'description', 'attachment', 'delete'];
  customers: Customer[] = [];
  models: ProductModel[] = [];
  category: Category[] = [];

  productDataSource!: MatTableDataSource<Product>;
  categoryDataSource!: MatTableDataSource<Category>;
  modelDataSource!: MatTableDataSource<ProductModel>;
  @ViewChild('barcode') barcode: ElementRef | undefined;
  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private productPriceService: ProductPriceService
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
    this.categoryDataSource.filter = filterValue.trim();

    if (this.categoryDataSource.paginator) {
      this.categoryDataSource.paginator.firstPage();
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
        height: '450px',
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          result.modelData.id = this.models.length + 1;
          this.models.push(result.modelData);
        },
        complete: () => {
          this.modelDataSource = new MatTableDataSource(this.models);
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

    this.categoryDataSource._updateChangeSubscription();
  }
  add(data: Product) {
    let pieces: string[] = [];
    data.api_prices?.forEach((price) => pieces.push(price.unit_ar));

    const elementIndex = this.category.findIndex(
      (category) => category.id == data.id
    );
    if (elementIndex != -1) {
      this.category[elementIndex].quantity = (
        parseInt(this.category[elementIndex].quantity) + 1
      ).toString();
    } else {
      // this.getPrice(14);

      let product = {
        id: data.id!,
        name_ar: data.name_ar,
        quantity: '1',
        pieces: pieces,
        total: '0',
        price: '0',
      };
      this.category.push(product);
    }
    this.categoryDataSource = new MatTableDataSource(this.category);
  }
  getProductByBarcode(barcode: any) {
    this.productService.getProductByBarcode(barcode.target.value).subscribe({
      next: (result: Product) => {
        this.add(result);
      },
      error: (err) => {
        this.snackBar.open('المنتج غير متوفر', 'Close', {
          duration: 1500,
        });
      },
      complete: () => {
        barcode.target.value = '';
      },
    });
  }
  focusBarcode() {
    this.barcode?.nativeElement.focus();
  }
  increaseQuantity(id: number) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == id
    );
    this.category[elementIndex].quantity = (
      parseInt(this.category[elementIndex].quantity) + 1
    ).toString();

    this.category[elementIndex].total = (
      parseInt(this.category[elementIndex].quantity) *
      parseInt(this.category[elementIndex].price)
    ).toString();

    this.categoryDataSource._updateChangeSubscription();
  }
  decreaseQuantity(id: number) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == id
    );

    if (this.category[elementIndex].quantity != '1') {
      this.category[elementIndex].quantity = (
        parseInt(this.category[elementIndex].quantity) - 1
      ).toString();
    }
    if (this.category[elementIndex].quantity != '0') {
      this.category[elementIndex].total = (
        parseInt(this.category[elementIndex].quantity) *
        parseInt(this.category[elementIndex].price)
      ).toString();
    }
  }
  changePrice(id: number, event: any) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == id
    );
    this.category[elementIndex].price = event.target.value;
    this.category[elementIndex].total = (
      parseInt(this.category[elementIndex].quantity) *
      parseInt(this.category[elementIndex].price)
    ).toString();
  }

  getPrice(id: number) {
    this.productPriceService.getProductPrice(id).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  printInvoice() {
    const pdf = new jsPDF('p', 'mm', [72, 297]);

    pdf.addFont('assets/fonts/Amiri-Regular.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');
    pdf.setFontSize(18);
    pdf.text(['الكســـــــــار'], 170, 10, {
      align: 'center',
    });
    pdf.text(['AL-KASSAR'], 40, 10, {
      align: 'center',
    });
    pdf.setFontSize(8);
    pdf.text(
      [
        'لخدمات العمرة و الزيارة',
        'ترخيص : 120107000100  س ت : 5800021621',
        'هاتف : 0177253157 جوال المكتب : 0559738321',
        'جوال : 0504760563 - 0552836914',
        'الباحة-الشارع العام-مقابل اكسترا',
      ],
      170,
      15,
      {
        align: 'center',
      }
    );
    pdf.text(
      [
        'for Umrah & visit service',
        'licence : 120107000100  c.r. : 5800021621',
        'Tel : 0177253157 Office : 0559738321',
        'Mob : 0504760563 - 0552836914',
        'Al-Baha-Main ST. opp. Extra',
      ],
      40,
      15,
      {
        align: 'center',
      }
    );
    pdf.text('فاتورة ضريبية', 105, 6, {
      align: 'center',
    });
    autoTable(pdf, {
      margin: { top: 35 },
      theme: 'plain',
      bodyStyles: { font: 'Amiri', halign: 'right' },
      body: [
        ['000000', 'الهاتف', '000000000000000', 'ترخيص'],
        ['0000', 'التاريخ', '000', 'رقم التذكرة'],
      ],
    });
    pdf.line(10, 53, 200, 53);

    pdf.autoPrint();
    const hideFrame = document.createElement('iframe');
    hideFrame.style.position = 'fixed';
    hideFrame.style.width = '1px';
    hideFrame.style.height = '1px';
    hideFrame.style.opacity = '0.01';
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      window.navigator.userAgent
    );
    if (isSafari) {
      hideFrame.onload = () => {
        try {
          hideFrame.contentWindow?.document.execCommand(
            'print',
            false,
            undefined
          );
        } catch (e) {
          hideFrame.contentWindow?.print();
        }
      };
    }
    hideFrame.src = pdf.output('bloburl').toString();
    document.body.appendChild(hideFrame);
  }
}
