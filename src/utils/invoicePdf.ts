// ============================================================
// SubFlow — Invoice PDF Generator
// Generates professional invoice PDFs with payment details
// ============================================================

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice, Payment } from '../types';

// Brand colors (RGB tuples)
const PRIMARY: [number, number, number] = [37, 99, 235];
const DARK: [number, number, number] = [15, 23, 42];
const GRAY: [number, number, number] = [100, 116, 139];
const LIGHT_BG: [number, number, number] = [248, 250, 252];
const WHITE: [number, number, number] = [255, 255, 255];
const BORDER: [number, number, number] = [226, 232, 240];

export function generateInvoicePDF(
  invoice: Invoice,
  payment?: Payment | null,
  options?: { mode?: 'invoice' | 'receipt' }
) {
  const mode = options?.mode || (invoice.status === 'paid' ? 'receipt' : 'invoice');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  // ---- Helper functions ----
  const addText = (text: string, x: number, yPos: number, opts?: { size?: number; color?: number[]; style?: 'normal' | 'bold' | 'italic'; align?: 'left' | 'center' | 'right' }) => {
    const size = opts?.size || 10;
    const color = opts?.color || DARK;
    const style = opts?.style || 'normal';
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    if (style === 'bold') {
      doc.setFont('helvetica', 'bold');
    } else if (style === 'italic') {
      doc.setFont('helvetica', 'italic');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    const align = opts?.align || 'left';
    if (align === 'center') {
      doc.text(text, pageWidth / 2, yPos, { align: 'center' });
    } else if (align === 'right') {
      doc.text(text, x, yPos, { align: 'right' });
    } else {
      doc.text(text, x, yPos);
    }
  };

  const drawLine = (yPos: number, color = BORDER) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  const drawRect = (x: number, yPos: number, w: number, h: number, fillColor: number[]) => {
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.rect(x, yPos, w, h, 'F');
  };

  // Styled logo icon helper
  const drawLogoIcon = (x: number, yPos: number) => {
    doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.roundedRect(x, yPos, 10, 10, 2, 2, 'F');
    
    // Draw white 'S' text logo inside the rounded box (robust & reliable)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('S', x + 3.2, yPos + 7.5);
  };

  // Styled pill status helper
  const drawStatusPill = (status: string, x: number, yPos: number) => {
    let bg: [number, number, number] = [241, 245, 249]; // Slate 100
    let fg: [number, number, number] = [71, 85, 105];   // Slate 600
    
    if (status === 'paid') {
      bg = [220, 252, 231]; // Green 100
      fg = [21, 128, 61];   // Green 700
    } else if (status === 'pending') {
      bg = [254, 243, 199]; // Amber 100
      fg = [180, 83, 9];    // Amber 700
    } else if (status === 'refunded') {
      bg = [243, 232, 255]; // Purple 100
      fg = [109, 40, 217];  // Purple 700
    } else if (status === 'failed') {
      bg = [254, 226, 226]; // Red 100
      fg = [185, 28, 28];   // Red 700
    }

    const label = status.toUpperCase();
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    const textWidth = doc.getTextWidth(label);
    const pillW = textWidth + 8;
    const pillH = 6;
    
    // Draw rounded rect
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.roundedRect(x - pillW, yPos - 4.5, pillW, pillH, 1.5, 1.5, 'F');
    
    // Draw text inside the pill
    doc.setTextColor(fg[0], fg[1], fg[2]);
    doc.text(label, x - pillW + 4, yPos - 0.5);
  };

  // ================================================================
  // HEADER
  // ================================================================

  // Top accent bar
  drawRect(0, 0, pageWidth, 3, PRIMARY);

  y = 16;

  // Company logo & info (left)
  drawLogoIcon(margin, y);
  addText('SubFlow', margin + 13, y + 6, { size: 18, style: 'bold', color: PRIMARY });
  addText('Subscription Management Portal', margin + 13, y + 9.5, { size: 8, color: GRAY });
  
  // Document title (right)
  const titleText = mode === 'receipt' ? 'PAYMENT RECEIPT' : 'INVOICE';
  addText(titleText, pageWidth - margin, y + 5, { size: 20, style: 'bold', color: DARK, align: 'right' });

  // Status badge (right, below title)
  drawStatusPill(invoice.status, pageWidth - margin, y + 12);

  y += 15;
  addText('123 Innovation Drive, San Francisco, CA 94107', margin, y, { size: 7.5, color: GRAY });
  addText('support@subflow.io | +1 (800) 555-0199', pageWidth - margin, y, { size: 7.5, color: GRAY, align: 'right' });
  y += 3.5;
  addText('www.subflow.io', margin, y, { size: 7.5, color: PRIMARY });
  
  y += 5;
  drawLine(y);
  y += 8;

  // ================================================================
  // INVOICE / RECEIPT DETAILS
  // ================================================================

  const col1 = margin;
  const boxW = 82;
  const boxX = pageWidth - margin - boxW;
  const detailStartY = y + 5;

  const details = [
    ['Invoice Number:', invoice.invoice_number || 'N/A'],
    ['Issue Date:', formatDate(invoice.created_at)],
    ['Due Date:', invoice.due_date],
    ...(invoice.paid_at ? [['Paid On:', formatDate(invoice.paid_at)]] : []),
    ...(payment?.transaction_id ? [['Transaction ID:', payment.transaction_id.slice(0, 18) + (payment.transaction_id.length > 18 ? '...' : '')]] : []),
    ...(payment?.method ? [['Method:', payment.method]] : []),
    ...(payment?.card_brand ? [['Card:', `${capitalize(payment.card_brand)} •••• ${payment.card_last4}`]] : []),
  ];

  const boxH = details.length * 5 + 7;

  // Draw light metadata card panel
  drawRect(boxX, detailStartY - 3, boxW, boxH, LIGHT_BG);
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, detailStartY - 3, boxW, boxH, 2, 2, 'S');

  // Render metadata inside the panel card
  details.forEach(([label, value], i) => {
    const dy = detailStartY + i * 5;
    addText(label, boxX + 4, dy, { size: 7.5, color: GRAY });
    addText(value, boxX + 30, dy, { size: 8, style: 'bold' });
  });

  // Render Bill To (on the left, vertically aligned with the panel card)
  addText('BILL TO', col1, detailStartY, { size: 8, style: 'bold', color: GRAY });
  let billToY = detailStartY + 5;
  addText(payment?.card_holder || invoice.user_email?.split('@')[0] || 'Valued Customer', col1, billToY, { size: 10, style: 'bold' });
  billToY += 4.5;
  addText(invoice.user_email || 'customer@email.com', col1, billToY, { size: 8.5, color: GRAY });
  billToY += 4;
  
  if (payment?.billing_address) {
    addText(payment.billing_address, col1, billToY, { size: 8, color: GRAY });
    billToY += 3.5;
    addText(`${payment.billing_city}, ${payment.billing_state} ${payment.billing_zip}`, col1, billToY, { size: 8, color: GRAY });
    billToY += 3.5;
    addText(payment.billing_country || '', col1, billToY, { size: 8, color: GRAY });
  }

  y = Math.max(billToY, detailStartY + boxH) + 12;

  // ================================================================
  // SERVICE DETAILS TABLE
  // ================================================================

  addText('SERVICE DETAILS', margin, y, { size: 9, style: 'bold', color: PRIMARY });
  y += 5;

  const isAnnual = invoice.plan_name?.toLowerCase().includes('annual') || invoice.plan_name?.toLowerCase().includes('yearly') || invoice.plan_name?.toLowerCase().includes('yr');
  const billingPeriod = isAnnual ? 'Annual' : 'Monthly';

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    styles: {
      lineColor: BORDER,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: PRIMARY,
      textColor: WHITE,
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: DARK,
    },
    alternateRowStyles: {
      fillColor: LIGHT_BG,
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.45 },
      1: { cellWidth: contentWidth * 0.2, halign: 'center' },
      2: { cellWidth: contentWidth * 0.15, halign: 'center' },
      3: { cellWidth: contentWidth * 0.2, halign: 'right' },
    },
    head: [['Description', 'Billing Period', 'Quantity', 'Amount']],
    body: [
      [
        `${invoice.service_name || 'Service'} — ${invoice.plan_name || 'Plan'}`,
        billingPeriod,
        '1',
        `$${invoice.amount.toFixed(2)}`,
      ],
    ],
  });

  // Get the Y position after the table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8;

  // ================================================================
  // TOTALS
  // ================================================================

  const totalsX = pageWidth - margin - 75;
  const valueX = pageWidth - margin;

  const totals = [
    ['Subtotal', `$${invoice.amount.toFixed(2)}`],
    [`Tax (18%)`, `$${invoice.tax.toFixed(2)}`],
    ...(invoice.discount > 0 ? [['Discount', `-$${invoice.discount.toFixed(2)}`]] : []),
  ];

  totals.forEach(([label, value]) => {
    addText(label, totalsX, y, { size: 8.5, color: GRAY, align: 'right' });
    addText(value, valueX, y, { size: 8.5, align: 'right' });
    y += 4.5;
  });

  y += 2;
  const totalBoxW = 90;
  const totalBoxH = 10;
  const totalBoxX = pageWidth - margin - totalBoxW;
  
  // Total accent card
  drawRect(totalBoxX, y - 2, totalBoxW, totalBoxH, LIGHT_BG);
  doc.setDrawColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(totalBoxX, y - 2, totalBoxW, totalBoxH, 1.5, 1.5, 'S');

  const totalLabel = invoice.status === 'paid' ? 'TOTAL PAID' : 'TOTAL DUE';
  addText(totalLabel, totalBoxX + 4, y + 4.5, { size: 10, style: 'bold', color: PRIMARY });
  addText(`$${invoice.total.toFixed(2)}`, valueX - 4, y + 4.5, { size: 11, style: 'bold', color: PRIMARY, align: 'right' });
  
  y += totalBoxH + 6;

  // ================================================================
  // PAYMENT DETAILS (if receipt mode)
  // ================================================================

  if (mode === 'receipt' && payment) {
    addText('PAYMENT CONFIRMATION', margin, y, { size: 9, style: 'bold', color: PRIMARY });
    y += 5;

    const payInfo = [
      ['Transaction ID', payment.transaction_id],
      ['Payment Method', payment.method_type === 'card' && payment.card_brand
        ? `${capitalize(payment.card_brand)} Card (•••• ${payment.card_last4})`
        : payment.method],
      ['Payment Date', formatDate(payment.paid_at)],
      ['Amount Paid', `$${payment.total.toFixed(2)}`],
      ['Status', 'Confirmed'],
    ];

    // Draw a light background box
    const cardH = payInfo.length * 6 + 4;
    drawRect(margin, y - 2, contentWidth, cardH, LIGHT_BG);
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y - 2, contentWidth, cardH, 2, 2, 'S');

    payInfo.forEach(([label, value]) => {
      addText(label, margin + 4, y + 2.5, { size: 8, color: GRAY });
      if (label === 'Status') {
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(margin + 50, y - 1, 20, 4.5, 1, 1, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(21, 128, 61);
        doc.text('✓ SUCCESS', margin + 52, y + 2.2);
      } else {
        addText(value, margin + 50, y + 2.5, { size: 8.5, style: 'bold' });
      }
      y += 6;
    });
    y += 8;
  }

  // ================================================================
  // NOTES / TERMS
  // ================================================================

  if (mode === 'invoice' && invoice.status === 'pending') {
    addText('PAYMENT INSTRUCTIONS', margin, y, { size: 9, style: 'bold', color: DARK });
    y += 5;
    addText('Please complete the payment before the due date to avoid service interruption.', margin, y, { size: 8, color: GRAY });
    y += 4;
    addText('You can pay online at subflow.io/billing or contact support for assistance.', margin, y, { size: 8, color: GRAY });
    y += 8;
  }

  // Terms
  addText('TERMS & CONDITIONS', margin, y, { size: 8, style: 'bold', color: GRAY });
  y += 4;
  addText('1. Payment is due within 7 days of the invoice date.', margin, y, { size: 7, color: [148, 163, 184] }); y += 3.5;
  addText('2. Late payments may be subject to a 1.5% monthly interest charge.', margin, y, { size: 7, color: [148, 163, 184] }); y += 3.5;
  addText('3. All amounts are shown in USD. Taxes are calculated at the prevailing rate.', margin, y, { size: 7, color: [148, 163, 184] }); y += 3.5;
  addText('4. For billing questions, contact support@subflow.io or call +1 (800) 555-0199.', margin, y, { size: 7, color: [148, 163, 184] }); y += 8;

  // ================================================================
  // FOOTER
  // ================================================================

  const footerY = doc.internal.pageSize.getHeight() - 20;
  drawLine(footerY - 5, BORDER);

  addText('Thank you for your business!', 0, footerY, { size: 9, style: 'italic', color: PRIMARY, align: 'center' });
  addText(`SubFlow Inc. | Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, footerY + 5, { size: 7, color: [148, 163, 184], align: 'center' });

  // ================================================================
  // SAVE
  // ================================================================

  const filename = mode === 'receipt'
    ? `SubFlow_Receipt_${invoice.invoice_number?.slice(0, 16) || invoice.id.slice(0, 8)}.pdf`
    : `SubFlow_Invoice_${invoice.invoice_number?.slice(0, 16) || invoice.id.slice(0, 8)}.pdf`;

  doc.save(filename);

  return filename;
}

// ---- Helpers ----

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function capitalize(str: string | null | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}