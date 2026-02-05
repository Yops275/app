import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
    orderId: number;
    customerName: string;
    customerEmail: string;
    date: Date;
    totalAmount: number;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
}

export class InvoiceService {
    public async generateInvoice(data: InvoiceData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: any[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            doc.on('error', (err) => {
                reject(err);
            });

            // Header
            doc.fontSize(20).text('INVOICE', 50, 50);
            doc.fontSize(10).text(`Invoice Number: ${data.orderId}`, 50, 80);
            doc.text(`Date: ${data.date.toLocaleDateString()}`, 50, 95);
            doc.text(`Customer: ${data.customerName}`, 50, 110);
            doc.text(`Email: ${data.customerEmail}`, 50, 125);

            // Table Header
            const invoiceTableTop = 160;
            doc.font('Helvetica-Bold');
            this.generateTableRow(
                doc,
                invoiceTableTop,
                'Item',
                'Quantity',
                'Unit Cost',
                'Line Total'
            );
            this.generateHr(doc, invoiceTableTop + 20);
            doc.font('Helvetica');

            // Table Content
            let i = 0;
            data.items.forEach((item, index) => {
                const y = invoiceTableTop + 35 + (i * 30);
                this.generateTableRow(
                    doc,
                    y,
                    item.productName,
                    item.quantity.toString(),
                    this.formatCurrency(item.price),
                    this.formatCurrency(item.price * item.quantity)
                );
                this.generateHr(doc, y + 20);
                i++;
            });

            // Total
            const subtotalPosition = invoiceTableTop + (i + 1) * 30;
            doc.font('Helvetica-Bold');
            this.generateTableRow(
                doc,
                subtotalPosition,
                '',
                '',
                'Total',
                this.formatCurrency(data.totalAmount)
            );

            // Footer
            doc.fontSize(10).text(
                'Payment is due within 15 days. Thank you for your business.',
                50,
                700,
                { align: 'center', width: 500 }
            );

            doc.end();
        });
    }

    private generateTableRow(
        doc: PDFKit.PDFDocument,
        y: number,
        item: string,
        quantity: string,
        unitCost: string,
        lineTotal: string
    ) {
        doc.fontSize(10)
            .text(item, 50, y)
            .text(quantity, 280, y, { width: 90, align: 'right' })
            .text(unitCost, 370, y, { width: 90, align: 'right' })
            .text(lineTotal, 0, y, { align: 'right' });
    }

    private generateHr(doc: PDFKit.PDFDocument, y: number) {
        doc.strokeColor('#aaaaaa')
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    private formatCurrency(amount: number) {
        return "$" + (amount).toFixed(2);
    }
}
