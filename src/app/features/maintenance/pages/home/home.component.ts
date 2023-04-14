import { Api_prices } from './../../models/product';
import { InvoiceService } from './../../services/invoice.service';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Category } from '../../models/category';
import { ProductModel } from '../../models/product-model';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { ProductPriceService } from '../../services/product-price.service';
import { BarcodeService } from '../../services/barcode.service';
import { AddAgentComponent } from '../../components/add-agent/add-agent.component';
import { AddModelComponent } from '../../components/add-model/add-model.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  qr = '';
  companyName = 'لغات العصر';
  vat_number = '123456789';
  totalPrice = 0;
  invoiceForm = this.fb.group({
    customer: [''],
    date: [''],
    paymentMethod: [''],
    paymentWay: [''],
    price: [{ value: 0, disabled: true }],
    vat: [{ value: 0, disabled: true }],
    total: [{ value: 0, disabled: true }],
    paid: [0],
    change: [{ value: 0, disabled: true }],
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
    private productPriceService: ProductPriceService,
    private qrService: BarcodeService,
    private invoiceService: InvoiceService
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
    let pieces: Api_prices[] = data.api_prices!;
    // ?.forEach((price) => pieces.push(price.unit_ar));
    const elementIndex = this.category.findIndex(
      (category) => category.id == data.id
    );
    if (elementIndex != -1 && Number(data.quantity) != 0) {
      this.increaseQuantity(data.id);
      data.quantity = (Number(data.quantity) - 1).toString();
      this.productDataSource._updateChangeSubscription();
    } else if (elementIndex == -1) {
      let product = {
        id: data.id!,
        name_ar: data.name_ar,
        quantity: '1',
        pieces: pieces,
        total: '0',
        price: '0',
      };
      this.category.push(product);
      data.quantity = (Number(data.quantity) - 1).toString();
      this.productDataSource._updateChangeSubscription();
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
    this.calculateTotal();
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
    this.calculateTotal();
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
    this.calculateTotal();
  }
  calculateTotal() {
    this.totalPrice = 0;
    this.category.forEach((category) => {
      this.totalPrice += parseInt(category.total);
    });
    this.invoiceForm.patchValue({
      price: this.totalPrice,
      vat: this.totalPrice * 0.15,
      total: this.totalPrice + this.totalPrice * 0.15,
    });
  }
  changePiece(id: number, event: any) {
    const elementIndex = this.category.findIndex(
      (category) => category.id == id
    );
    this.category[elementIndex].pieces[0] = event.target.value;
  }
  getPrice(id: number) {
    this.productPriceService.getProductPrice(id).subscribe({
      next: (result) => {},
      error: (err) => {},
      complete: () => {},
    });
  }
  pay(event: any) {
    this.invoiceForm.patchValue({
      change: event.target.value - (this.totalPrice - this.totalPrice * 0.15),
    });
  }
  printInvoice() {
    this.qrService
      .generateQRCode({
        date: new Date(this.invoiceForm.value.date!).toISOString(),
        seller_name: this.companyName,
        total: this.invoiceForm.value.total!,
        tax: this.invoiceForm.value.vat!,
        vat_number: this.vat_number,
      })
      .subscribe({
        next: (result) => {
          this.qr = String(result);
        },
        complete: () => {
          this.invoiceService
            .create({
              date: new Date(this.invoiceForm.value.date!).toISOString(),
              customer_id: Number(this.invoiceForm.value.customer)!,
              grand_total: this.invoiceForm.value.total!,
              invoice_type: this.invoiceForm.value.paymentMethod!,
              payment_method: this.invoiceForm.value.paymentWay!,
              tax: this.invoiceForm.value.vat!,
              total: this.invoiceForm.value.price!,
              models: this.models.map((model) => {
                return {
                  description: model.description!,
                  attachments: model.attachment!,
                  model_id: model.id!,
                };
              }),
              items: this.category.map((category) => {
                return {
                  part_id: category.id!,
                  quantity: Number(category.quantity)!,
                  selling_price: Number(category.price)!,
                  unit_id: category.pieces[0].id!,
                };
              }),
            })
            .subscribe({
              next: (result) => {
                this.snackBar.open('تمت العملية بنجاح', 'Close', {
                  duration: 1500,
                });
              },
              complete: () => {
                this.print();
              },
              error: (err) => {
                this.snackBar.open(' 2 حدث خطأ ما', 'Close', {
                  duration: 1500,
                });
              },
            });
        },
        error: (err) => {
          this.snackBar.open(' 1 حدث خطأ ما', 'Close', {
            duration: 1500,
          });
        },
      });
  }

  print() {
    const modelBody = this.models.map((model) => {
      return {
        attachment: model.attachment,
        description: model.description,
        model: model.model,
      };
    });
    const categoryBody = this.category.map((category) => {
      return {
        name_ar: category.name_ar,
        quantity: category.quantity,
        unit: category.pieces[0].unit_ar,
        price: category.price,
      };
    });

    const pdf = new jsPDF('p', 'mm', [72, 297]);

    pdf.addFont('assets/fonts/Amiri-Regular.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');
    pdf.setFontSize(18);
    pdf.text(this.companyName, 36, 10, {
      align: 'center',
      maxWidth: 100,
    });

    pdf.setFontSize(12);

    pdf.text('الرقم الضريبي:01248624445', 36, 25, {
      align: 'center',
    });
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(2, 30, 70, 30);
    pdf.setFontSize(16);
    pdf.text('فاتورة ضريبية مبسطة', 36, 35, {
      align: 'center',
    });

    pdf.setFontSize(12);

    const customer: Customer = this.customers.find(
      (customer) => customer.id == this.invoiceForm.value.customer
    )!;

    autoTable(pdf, {
      margin: {
        top: 43,
        right: 0,
        left: 0,
      },

      theme: 'plain',
      tableWidth: pdf.internal.pageSize.getWidth(),
      bodyStyles: { font: 'Amiri', halign: 'right' },
      body: [
        [customer.name_ar, 'اسم العميل'],
        [customer.phone1 ? customer.phone1 : 'لا يوجد', 'الهاتف'],
        [
          new Date(this.invoiceForm.value.date!).toISOString().split('T')[0],
          'التاريخ',
        ],
      ],
    });

    autoTable(pdf, {
      margin: {
        top: 70,
        right: 0,
        left: 0,
      },

      theme: 'striped',

      tableWidth: pdf.internal.pageSize.getWidth(),

      bodyStyles: { font: 'Amiri', halign: 'right' },
      headStyles: {
        font: 'Amiri',
        halign: 'right',
        fillColor: 'black',
        cellPadding: 0.5,
        overflow: 'visible',
      },
      columns: [
        { header: 'المحلقات', dataKey: 'attachment' },
        { header: 'الوصف', dataKey: 'description' },
        { header: 'الموديل', dataKey: 'model' },
      ],

      body: modelBody,
    });

    autoTable(pdf, {
      margin: {
        top: 70,
        right: 0,
        left: 0,
      },

      theme: 'striped',

      tableWidth: pdf.internal.pageSize.getWidth(),

      bodyStyles: { font: 'Amiri', halign: 'right' },
      headStyles: {
        font: 'Amiri',
        halign: 'right',
        fillColor: 'black',
        cellPadding: 0.5,
        overflow: 'visible',
      },
      columns: [
        { header: 'السعر', dataKey: 'price' },
        { header: 'الكمية', dataKey: 'quantity' },
        { header: 'الوحدة', dataKey: 'unit' },
        { header: 'الاسم', dataKey: 'name_ar' },
      ],
      body: categoryBody,
    });
    autoTable(pdf, {
      margin: {
        top: 70,
        right: 0,
        left: 0,
      },

      theme: 'plain',
      tableWidth: pdf.internal.pageSize.getWidth(),
      bodyStyles: { font: 'Amiri', halign: 'right' },
      body: [
        [this.totalPrice, 'الاجمالي بدون ضريبة'],
        [this.totalPrice * 0.15, 'الضريبة'],
        [this.totalPrice + this.totalPrice * 0.15, 'الاجمالي'],
      ],
    });
    autoTable(pdf, {
      margin: {
        top: 70,
        right: 0,
        left: 0,
      },

      theme: 'plain',
      tableWidth: pdf.internal.pageSize.getWidth(),
      bodyStyles: {
        font: 'Amiri',
        halign: 'right',
        cellPadding: 0.5,
        overflow: 'visible',
      },
      body: [
        ['01279548558', 'المبيعات'],
        ['الباحة - الحاوية - ش الامير سلطان', 'العنوان'],
      ],
      didDrawCell: (data) => {
        if (
          data.section === 'body' &&
          data.row.index === data.table.body.length - 1
        ) {
          pdf.addImage(this.qr, 'png', 16, data.cell.y + 10, 40, 40);
        }
      },
    });

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
