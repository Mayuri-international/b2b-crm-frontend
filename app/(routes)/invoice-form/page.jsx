'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Download, Printer } from 'lucide-react';

// import { html2pdf } from 'html2pdf.js';

import {html2pdf}  from "html2pdf.js";

export default function InvoiceFormPage() {
  const invoiceRef = useRef(null);
  const GST_NO = '29CQPPK1384J1Z7';
  const PAN_NO = 'CQPPK1384J';
  const STATE_CODE = '29';
  const companyAddress = 'Kammasandra Augusta link Rd, Kada Agrahara Village, Bidarahalli Hobli, Post, Dodda Gubbi, Karnataka - 560049';
  const companyContact = 'Mob: 9731734610';
  const companyEmail = 'mayuri.intl@gmail.com';

  const [items, setItems] = useState([
    { description: '', hsn: '', unit: '', qty: 1, unitPrice: 0 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: '', hsn: '', unit: '', qty: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const sgst = totalAmount * 0.09;
  const cgst = totalAmount * 0.09;
  const grandTotal = totalAmount + sgst + cgst;

  const handleDownload = () => {
    const element = invoiceRef.current;
    html2pdf().from(element).save('invoice.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6" ref={invoiceRef}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold uppercase">GST TAX INVOICE</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 text-center">
          <div className="font-semibold text-lg">THE MAYURI INTERNATIONAL</div>
          <div>{companyAddress}</div>
          <div>{companyContact} | e-mail: {companyEmail}</div>
          <div>GSTIN: {GST_NO} | PAN: {PAN_NO}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label>Invoice No</Label>
            <Input placeholder="e.g., INV001" />
          </div>
          <div>
            <Label>Invoice Date</Label>
            <Input type="date" />
          </div>
          <div>
            <Label>Buyer Name</Label>
            <Input placeholder="Customer Name" />
          </div>
          <div>
            <Label>Buyer Address</Label>
            <Textarea placeholder="Billing Address" />
          </div>
          <div>
            <Label>GSTIN</Label>
            <Input placeholder="Buyer GSTIN Number" />
          </div>
          <div>
            <Label>PAN</Label>
            <Input placeholder="Buyer PAN Number" />
          </div>
          <div>
            <Label>State Code</Label>
            <Input value={STATE_CODE} disabled />
          </div>
          <div>
            <Label>Vehicle No / e-Way Bill</Label>
            <Input placeholder="KA 03 AN 0300 / EW123456" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-end mb-4">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <Input
                placeholder="HSN"
                value={item.hsn}
                onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
              />
              <Input
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
              />
              <Button variant="ghost" onClick={() => removeItem(index)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button onClick={addItem} variant="outline">
            <Plus size={16} className="mr-2" /> Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label>Total Taxable Amount</Label>
            <Input value={totalAmount.toFixed(2)} disabled />
          </div>
          <div>
            <Label>SGST (9%)</Label>
            <Input value={sgst.toFixed(2)} disabled />
          </div>
          <div>
            <Label>CGST (9%)</Label>
            <Input value={cgst.toFixed(2)} disabled />
          </div>
          <div className="col-span-3">
            <Label>Grand Total</Label>
            <Input value={grandTotal.toFixed(2)} className="text-lg font-semibold" disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea rows={6} defaultValue={`1. Goods once sold will not be taken back.
2. Payment should be made by a/c payee cheque/DD/NEFT/RTGS only.
3. Payment not made within the due date will attract Interest @ 18%.
4. Dishonoured cheques invite penal action under Indian Penal Code.
5. Subject to Bangalore Jurisdiction only.
6. Manufacturing defects must be reported within 1 week.`} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 pt-4">
        <Button className="w-full" onClick={handleDownload}>
          <Download className="mr-2" size={18} /> Download PDF
        </Button>
        <Button className="w-full" onClick={handlePrint}>
          <Printer className="mr-2" size={18} /> Print
        </Button>
      </div>
    </div>
  );
}


