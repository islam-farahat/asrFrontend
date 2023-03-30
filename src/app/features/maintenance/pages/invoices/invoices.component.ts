import { BarcodeService } from './../../services/barcode.service';
import { EditInvoiceComponent } from './../../components/edit-invoice/edit-invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Invoice } from './../../models/invoice';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceService } from '../../services/invoice.service';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements AfterViewInit {
  date = this.fb.group({
    start: ['', Validators.required],
    end: ['', Validators.required],
  });
  displayedColumns: string[] = ['id', 'total', 'date', 'edit', 'print'];
  dataSource: MatTableDataSource<Invoice>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  qr: string = '';

  constructor(
    private invoiceService: InvoiceService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private qrService: BarcodeService
  ) {
    invoiceService.getInvoices({}).subscribe((invoices) => {
      console.log(invoices);
    });
    const invoices: Invoice[] = [
      {
        id: 1,
        customer_id: 1,
        date: '2021-01-01',
        grand_total: 100,
        invoice_type: 'type',
        payment_method: 'method',
        tax: 10,
        total: 90,
        models: [
          {
            attachments: 'attachments',
            description: 'description',
            model_id: 1,
          },
        ],
        invoice_items: [
          {
            part_id: 1,
            quantity: 1,
            selling_price: 1,
            unit_id: 1,
          },
        ],
      },
    ];

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(invoices);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  find() {
    this.invoiceService
      .getInvoices({
        date_from: moment(this.date.value.start).format('yyyy-MM-DD'),
        date_to: moment(this.date.value.end).format('yyyy-MM-DD'),
      })
      .subscribe((invoices) => {
        console.log(invoices);
      });
  }

  edit(invoice: Invoice) {
    this.dialog.open(EditInvoiceComponent, {
      data: invoice,
      disableClose: true,
      width: '400px',
      height: '420px',
    });
  }
  print(invoice: Invoice) {
    this.qrService
      .generateQRCode({
        date: invoice.date,
        seller_name: 'لغات العصر',
        total: invoice.grand_total,
        tax: invoice.tax,
        vat_number: '123456789',
      })
      .subscribe({
        next: (result) => {
          this.qr = String(result);
        },
        complete: () => {
          this.printInvoice(invoice);
        },
      });
  }
  printInvoice(invoice: Invoice) {
    const modelBody = invoice.models.map((model) => {
      return {
        attachment: model.attachments,
        description: model.description,
        model: model.model_id,
      };
    });
    const categoryBody = invoice.invoice_items.map((category) => {
      return {
        name_ar: category.part_id,
        quantity: category.quantity,
        unit: category.unit_id,
        price: category.selling_price,
      };
    });

    const pdf = new jsPDF('p', 'mm', [72, 297]);

    pdf.addFont('assets/fonts/Amiri-Regular.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');
    pdf.setFontSize(18);
    pdf.text('لغات العصر', 36, 10, {
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

    // const customer: Customer = this.customers.find(
    //   (customer) => customer.id == this.invoiceForm.value.customer
    // )!;

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
        [invoice.customer_id, 'اسم العميل'],
        [invoice.customer_id ? invoice.customer_id : 'لا يوجد', 'الهاتف'],
        [invoice.date, 'التاريخ'],
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
        [invoice.total, 'الاجمالي بدون ضريبة'],
        [invoice.tax, 'الضريبة'],
        [invoice.grand_total, 'الاجمالي'],
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
