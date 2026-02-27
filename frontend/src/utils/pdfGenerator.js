// PDF Generator utility for Quotations and Invoices

export const generateQuotationPDF = (data) => {
  const { quotation, client, customer } = data;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quotation - ${quotation.quotation_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #1e40af; }
        .company-info h1 { color: #1e40af; font-size: 28px; margin-bottom: 5px; }
        .company-info p { color: #666; font-size: 14px; }
        .doc-info { text-align: right; }
        .doc-info h2 { color: #1e40af; font-size: 24px; margin-bottom: 10px; }
        .doc-info p { font-size: 14px; color: #666; }
        .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .party-box { width: 45%; }
        .party-box h3 { color: #1e40af; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e5e5e5; }
        .party-box p { font-size: 14px; margin-bottom: 3px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
        .items-table tr:nth-child(even) { background: #f8fafc; }
        .totals { width: 300px; margin-left: auto; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        .totals-row.total { border-top: 2px solid #1e40af; border-bottom: none; padding-top: 12px; font-size: 18px; font-weight: bold; color: #1e40af; }
        .notes { margin-top: 30px; padding: 15px; background: #f8fafc; border-left: 3px solid #1e40af; }
        .notes h4 { color: #1e40af; margin-bottom: 5px; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
        .status-draft { background: #fef3c7; color: #92400e; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-accepted { background: #d1fae5; color: #065f46; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${client?.business_name || 'FrameBook Pro'}</h1>
          <p>${client?.email || ''}</p>
          <p>${client?.phone || ''}</p>
        </div>
        <div class="doc-info">
          <h2>QUOTATION</h2>
          <p><strong>${quotation.quotation_number}</strong></p>
          <p>Date: ${new Date(quotation.created_at).toLocaleDateString()}</p>
          <p><span class="status-badge status-${quotation.status}">${quotation.status}</span></p>
        </div>
      </div>

      <div class="parties">
        <div class="party-box">
          <h3>From</h3>
          <p><strong>${client?.business_name || 'FrameBook Pro'}</strong></p>
          <p>${client?.email || ''}</p>
          <p>${client?.phone || ''}</p>
        </div>
        <div class="party-box">
          <h3>To</h3>
          <p><strong>${customer?.name || 'Customer'}</strong></p>
          <p>${customer?.email || ''}</p>
          <p>${customer?.phone || ''}</p>
          ${customer?.event_type ? `<p>Event: ${customer.event_type}</p>` : ''}
          ${customer?.event_date ? `<p>Date: ${new Date(customer.event_date).toLocaleDateString()}</p>` : ''}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.name}</td>
              <td style="text-transform: capitalize;">${item.item_type}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toLocaleString()}</td>
              <td>₹${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>₹${quotation.subtotal.toLocaleString()}</span>
        </div>
        ${quotation.discount_amount > 0 ? `
        <div class="totals-row">
          <span>Discount${quotation.discount_percentage > 0 ? ` (${quotation.discount_percentage}%)` : ''}</span>
          <span>-₹${quotation.discount_amount.toLocaleString()}</span>
        </div>
        ` : ''}
        ${quotation.tax_amount > 0 ? `
        <div class="totals-row">
          <span>Tax (${quotation.tax_percentage}%)</span>
          <span>₹${quotation.tax_amount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="totals-row total">
          <span>Grand Total</span>
          <span>₹${quotation.total_amount.toLocaleString()}</span>
        </div>
      </div>

      ${quotation.notes ? `
      <div class="notes">
        <h4>Notes</h4>
        <p>${quotation.notes}</p>
      </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This quotation is valid for 30 days from the date of issue.</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
};

export const generateInvoicePDF = (data) => {
  const { invoice, client, customer } = data;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${invoice.invoice_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #1e40af; }
        .company-info h1 { color: #1e40af; font-size: 28px; margin-bottom: 5px; }
        .company-info p { color: #666; font-size: 14px; }
        .doc-info { text-align: right; }
        .doc-info h2 { color: #1e40af; font-size: 24px; margin-bottom: 10px; }
        .doc-info p { font-size: 14px; color: #666; }
        .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .party-box { width: 45%; }
        .party-box h3 { color: #1e40af; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e5e5e5; }
        .party-box p { font-size: 14px; margin-bottom: 3px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #1e40af; color: white; padding: 12px; text-align: left; font-size: 14px; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
        .items-table tr:nth-child(even) { background: #f8fafc; }
        .totals { width: 300px; margin-left: auto; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        .totals-row.total { border-top: 2px solid #1e40af; border-bottom: none; padding-top: 12px; font-size: 18px; font-weight: bold; color: #1e40af; }
        .totals-row.paid { color: #059669; }
        .totals-row.due { color: #dc2626; font-weight: bold; }
        .payments { margin-top: 30px; }
        .payments h4 { color: #1e40af; margin-bottom: 10px; }
        .payment-item { display: flex; justify-content: space-between; padding: 8px; background: #f0fdf4; margin-bottom: 5px; border-radius: 4px; }
        .notes { margin-top: 30px; padding: 15px; background: #f8fafc; border-left: 3px solid #1e40af; }
        .notes h4 { color: #1e40af; margin-bottom: 5px; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
        .status-unpaid { background: #fee2e2; color: #dc2626; }
        .status-partially_paid { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${client?.business_name || 'FrameBook Pro'}</h1>
          <p>${client?.email || ''}</p>
          <p>${client?.phone || ''}</p>
        </div>
        <div class="doc-info">
          <h2>INVOICE</h2>
          <p><strong>${invoice.invoice_number}</strong></p>
          <p>Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}</p>
          ${invoice.event_date ? `<p>Event Date: ${new Date(invoice.event_date).toLocaleDateString()}</p>` : ''}
          <p><span class="status-badge status-${invoice.status}">${invoice.status.replace('_', ' ')}</span></p>
        </div>
      </div>

      <div class="parties">
        <div class="party-box">
          <h3>From</h3>
          <p><strong>${client?.business_name || 'FrameBook Pro'}</strong></p>
          <p>${client?.email || ''}</p>
          <p>${client?.phone || ''}</p>
        </div>
        <div class="party-box">
          <h3>Bill To</h3>
          <p><strong>${customer?.name || 'Customer'}</strong></p>
          <p>${customer?.email || ''}</p>
          <p>${customer?.phone || ''}</p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price.toLocaleString()}</td>
              <td>₹${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>₹${invoice.subtotal.toLocaleString()}</span>
        </div>
        ${invoice.discount_amount > 0 ? `
        <div class="totals-row">
          <span>Discount</span>
          <span>-₹${invoice.discount_amount.toLocaleString()}</span>
        </div>
        ` : ''}
        ${invoice.tax_amount > 0 ? `
        <div class="totals-row">
          <span>Tax</span>
          <span>₹${invoice.tax_amount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="totals-row total">
          <span>Grand Total</span>
          <span>₹${invoice.total_amount.toLocaleString()}</span>
        </div>
        <div class="totals-row paid">
          <span>Paid Amount</span>
          <span>₹${invoice.paid_amount.toLocaleString()}</span>
        </div>
        <div class="totals-row due">
          <span>Balance Due</span>
          <span>₹${invoice.balance_due.toLocaleString()}</span>
        </div>
      </div>

      ${invoice.payments && invoice.payments.length > 0 ? `
      <div class="payments">
        <h4>Payment History</h4>
        ${invoice.payments.map(p => `
          <div class="payment-item">
            <span>${new Date(p.payment_date).toLocaleDateString()} - ${p.payment_method || 'N/A'}</span>
            <span>₹${p.amount.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Payment is due within 15 days of invoice date.</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
};
