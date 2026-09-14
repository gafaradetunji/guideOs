import { useMemo, useState, type ReactNode } from 'react';
import {
  Plus, Download, Send, Trash2, Receipt, CheckCircle2, Ban, CreditCard, ArrowLeft, Printer,
} from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Button, Table, THead, Th, TBody, Tr, Td,
  Stat, Input, Select, Drawer, Modal, EmptyState, Badge,
} from '../../components/ui';
import { StatusBadge, FilterSelect, Pagination } from '../../components/ui/Filters';
import { customers, formatCurrency, formatDate, calcInvoiceTotals, type Invoice, type InvoiceLine } from '../../data/seed';
import { VAT_RATE, WHT_RATE } from '../../lib/tax';
import { useMockData, type InvoiceDraftInput } from '../../mock/MockDataProvider';
import type { RouteProps } from '../../lib/types';

const PAGE_SIZE = 10;

interface DraftLine extends Omit<InvoiceLine, 'id'> {
  key: string;
}

function blankLine(): DraftLine {
  return { key: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, description: '', quantity: 1, unitPrice: 0, taxable: true };
}

const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- list page

export function InvoicesPage({ navigate }: RouteProps) {
  const { invoices, createInvoice, updateInvoice, sendInvoice, deleteInvoice } = useMockData();
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);

  const filtered = useMemo(() => invoices.filter(inv =>
    (!statusFilter || inv.status === statusFilter) &&
    (!customerFilter || inv.customerId === customerFilter)
  ), [invoices, statusFilter, customerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Cancelled invoices are excluded from receivables; drafts are not yet owed.
  const live = invoices.filter(i => i.status !== 'cancelled' && i.status !== 'draft');
  const outstanding = live.reduce((a, i) => a + i.balance, 0);
  const collected = live.reduce((a, i) => a + i.amountPaid, 0);
  const overdue = invoices.filter(i => i.status === 'past_due').reduce((a, i) => a + i.balance, 0);
  const vatCollected = live.reduce((a, i) => a + i.vat, 0);

  function openNew() { setEditing(null); setComposerOpen(true); }
  function openEdit(inv: Invoice) { setEditing(inv); setComposerOpen(true); }

  function handleSave(input: InvoiceDraftInput) {
    if (editing) updateInvoice(editing.id, input);
    else createInvoice(input);
    setComposerOpen(false);
    setEditing(null);
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Customers', onClick: () => navigate('/customers') }, { label: 'Invoices' }]} />}
        title="Invoices"
        description="Raise, issue and settle customer invoices with VAT and withholding tax."
        actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openNew}>New Invoice</Button>}
      />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Outstanding" value={formatCurrency(outstanding)} delta={`${live.filter(i => i.balance > 0).length} open invoices`} tone="gray" />
          <Stat label="Collected" value={formatCurrency(collected)} tone="green" />
          <Stat label="Overdue" value={formatCurrency(overdue)} delta={`${invoices.filter(i => i.status === 'past_due').length} past due`} tone="red" />
          <Stat label="VAT Charged" value={formatCurrency(vatCollected)} delta="7.5% output VAT" tone="gray" />
        </div>

        <Card>
          <CardHeader
            title="All Invoices"
            subtitle={`${filtered.length} of ${invoices.length} invoices`}
            action={
              <div className="flex items-center gap-2">
                <FilterSelect label="Status" value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} options={[
                  { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' },
                  { value: 'part_paid', label: 'Part Paid' }, { value: 'paid', label: 'Paid' },
                  { value: 'past_due', label: 'Past Due' }, { value: 'cancelled', label: 'Cancelled' },
                ]} />
                <FilterSelect label="Customer" value={customerFilter} onChange={v => { setCustomerFilter(v); setPage(1); }}
                  options={customers.map(c => ({ value: c.id, label: c.company }))} />
                <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
              </div>
            }
          />
          <CardBody className="p-0">
            {paged.length === 0 ? (
              <EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices match" description="Adjust the filters, or raise a new invoice to get started."
                action={<Button size="sm" onClick={openNew}>New Invoice</Button>} />
            ) : (
              <>
                <Table>
                  <THead><tr><Th>Invoice #</Th><Th>Customer</Th><Th>Issued</Th><Th>Due</Th><Th>Total</Th><Th>Balance</Th><Th>Status</Th><Th /></tr></THead>
                  <TBody>
                    {paged.map(inv => (
                      <Tr key={inv.id} onClick={() => navigate(`/customers/invoices/${inv.id}`)}>
                        <Td className="text-sm font-mono text-ink-900">{inv.number}</Td>
                        <Td>
                          <div><p className="text-sm font-medium text-ink-900">{inv.customerCompany}</p>
                          <p className="text-[11px] text-ink-500">{inv.customerName}</p></div>
                        </Td>
                        <Td className="text-sm text-ink-500">{formatDate(inv.issueDate)}</Td>
                        <Td className="text-sm text-ink-500">{formatDate(inv.dueDate)}</Td>
                        <Td className="text-sm font-medium">{formatCurrency(inv.amountDue)}</Td>
                        <Td className={`text-sm font-semibold ${inv.balance > 0 ? 'text-ink-900' : 'text-emerald-700'}`}>{formatCurrency(inv.balance)}</Td>
                        <Td><StatusBadge status={inv.status} /></Td>
                        <Td>
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            {inv.status === 'draft' && (
                              <>
                                <Button variant="ghost" size="xs" onClick={() => openEdit(inv)}>Edit</Button>
                                <Button variant="ghost" size="xs" leftIcon={<Send className="h-3 w-3" />} onClick={() => sendInvoice(inv.id)}>Send</Button>
                                <Button variant="ghost" size="icon" aria-label="Delete draft" onClick={() => deleteInvoice(inv.id)}>
                                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                </Button>
                              </>
                            )}
                            {inv.status !== 'draft' && (
                              <Button variant="ghost" size="xs" onClick={() => navigate(`/customers/invoices/${inv.id}`)}>View</Button>
                            )}
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
                <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <InvoiceComposer
        open={composerOpen}
        invoice={editing}
        onClose={() => { setComposerOpen(false); setEditing(null); }}
        onSave={handleSave}
      />
    </div>
  );
}

// ------------------------------------------------------------ composer form

function InvoiceComposer({ open, invoice, onClose, onSave }: {
  open: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onSave: (input: InvoiceDraftInput) => void;
}) {
  const [customerId, setCustomerId] = useState(invoice?.customerId ?? customers[0].id);
  const [issueDate, setIssueDate] = useState(invoice?.issueDate ?? today());
  const [termsDays, setTermsDays] = useState(invoice?.termsDays ?? 30);
  const [applyWht, setApplyWht] = useState((invoice?.whtRate ?? 0) > 0);
  const [notes, setNotes] = useState(invoice?.notes ?? '');
  const [lines, setLines] = useState<DraftLine[]>(
    invoice ? invoice.lines.map(l => ({ ...l, key: l.id })) : [blankLine()]
  );
  // Re-seed the form whenever a different invoice (or a fresh draft) is opened.
  const [seededFor, setSeededFor] = useState<string | null>(invoice?.id ?? null);
  if (open && seededFor !== (invoice?.id ?? null)) {
    setSeededFor(invoice?.id ?? null);
    setCustomerId(invoice?.customerId ?? customers[0].id);
    setIssueDate(invoice?.issueDate ?? today());
    setTermsDays(invoice?.termsDays ?? 30);
    setApplyWht((invoice?.whtRate ?? 0) > 0);
    setNotes(invoice?.notes ?? '');
    setLines(invoice ? invoice.lines.map(l => ({ ...l, key: l.id })) : [blankLine()]);
  }

  const whtRate = applyWht ? WHT_RATE : 0;
  const totals = calcInvoiceTotals(lines, { vatRate: VAT_RATE, whtRate });
  const valid = lines.length > 0 && lines.every(l => l.description.trim() && l.quantity > 0 && l.unitPrice >= 0) && totals.subtotal > 0;

  function updateLine(key: string, patch: Partial<DraftLine>) {
    setLines(cur => cur.map(l => (l.key === key ? { ...l, ...patch } : l)));
  }

  function buildInput(send: boolean): InvoiceDraftInput {
    return {
      customerId, issueDate, termsDays, whtRate, vatRate: VAT_RATE, notes,
      lines: lines.map(line => ({ description: line.description, quantity: line.quantity, unitPrice: line.unitPrice, taxable: line.taxable })),
      send,
    };
  }

  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + Number(termsDays));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="max-w-3xl"
      title={invoice ? `Edit ${invoice.number}` : 'New Invoice'}
      description={invoice ? 'Changes recalculate VAT, withholding tax and balance.' : 'Add line items — VAT and totals calculate as you type.'}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="outline" size="sm" disabled={!valid} onClick={() => onSave(buildInput(false))}>
            {invoice ? 'Save Changes' : 'Save as Draft'}
          </Button>
          <Button size="sm" disabled={!valid} leftIcon={<Send className="h-3.5 w-3.5" />} onClick={() => onSave(buildInput(true))}>
            {invoice && invoice.status !== 'draft' ? 'Save & Re-issue' : 'Save & Send'}
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Customer">
            <Select value={customerId} onChange={e => setCustomerId(e.target.value)}>
              {customers.map(c => <option key={c.id} value={c.id}>{c.company} — {c.name}</option>)}
            </Select>
          </Field>
          <Field label="Issue Date">
            <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
          </Field>
          <Field label="Payment Terms">
            <Select value={String(termsDays)} onChange={e => setTermsDays(Number(e.target.value))}>
              <option value="7">Net 7 days</option>
              <option value="14">Net 14 days</option>
              <option value="30">Net 30 days</option>
              <option value="45">Net 45 days</option>
              <option value="60">Net 60 days</option>
            </Select>
          </Field>
          <Field label="Due Date">
            <div className="h-9 flex items-center text-sm text-ink-600">{formatDate(dueDate.toISOString().slice(0, 10))}</div>
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-ink-500">Line Items</p>
            <Button variant="outline" size="xs" leftIcon={<Plus className="h-3 w-3" />} onClick={() => setLines(cur => [...cur, blankLine()])}>Add Line</Button>
          </div>
          <div className="border border-ink-200 rounded-lg overflow-hidden">
            <Table>
              <THead><tr><Th>Description</Th><Th className="w-20">Qty</Th><Th className="w-36">Unit Price</Th><Th className="w-20">VAT</Th><Th className="w-32">Amount</Th><Th className="w-10" /></tr></THead>
              <TBody>
                {lines.map(line => (
                  <Tr key={line.key}>
                    <Td><Input value={line.description} placeholder="e.g. Platform subscription" onChange={e => updateLine(line.key, { description: e.target.value })} /></Td>
                    <Td><Input type="number" min={1} value={line.quantity} onChange={e => updateLine(line.key, { quantity: Number(e.target.value) || 0 })} /></Td>
                    <Td><Input type="number" min={0} step={1000} value={line.unitPrice} onChange={e => updateLine(line.key, { unitPrice: Number(e.target.value) || 0 })} /></Td>
                    <Td>
                      <button
                        onClick={() => updateLine(line.key, { taxable: !line.taxable })}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-md border ${line.taxable ? 'bg-brand-50 text-brand-700 border-brand-100' : 'bg-ink-100 text-ink-500 border-ink-200'}`}
                      >
                        {line.taxable ? 'Yes' : 'No'}
                      </button>
                    </Td>
                    <Td className="text-sm font-medium">{formatCurrency(line.quantity * line.unitPrice)}</Td>
                    <Td>
                      {lines.length > 1 && (
                        <Button variant="ghost" size="icon" aria-label="Remove line" onClick={() => setLines(cur => cur.filter(l => l.key !== line.key))}>
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Payment instructions, PO reference…"
              className="w-full rounded-md border border-ink-300 bg-white/90 px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 shadow-sm focus:border-brand-400 focus-ring"
            />
          </Field>
          <div className="rounded-lg border border-ink-200 bg-ink-50/60 p-4 space-y-2">
            <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
            <SummaryRow label={`VAT (${(VAT_RATE * 100).toFixed(1)}%)`} value={formatCurrency(totals.vat)} />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-ink-600">
                <input type="checkbox" checked={applyWht} onChange={e => setApplyWht(e.target.checked)} className="h-3.5 w-3.5 rounded border-ink-300" />
                Withholding tax ({(WHT_RATE * 100).toFixed(0)}%)
              </label>
              <span className="text-sm text-red-600">{applyWht ? `-${formatCurrency(totals.wht)}` : formatCurrency(0)}</span>
            </div>
            <div className="border-t border-ink-200 pt-2">
              <SummaryRow label="Invoice Total" value={formatCurrency(totals.total)} />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-semibold text-ink-900">Amount Payable</span>
                <span className="text-base font-semibold text-ink-900">{formatCurrency(totals.amountDue)}</span>
              </div>
              {applyWht && <p className="text-[11px] text-ink-500 mt-1.5">Customer withholds {formatCurrency(totals.wht)} and remits it to FIRS on your behalf.</p>}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

// -------------------------------------------------------------- detail page

export function InvoiceDetailPage({ path, navigate }: RouteProps) {
  const { invoices, sendInvoice, recordInvoicePayment, cancelInvoice } = useMockData();
  const id = path.split('/').pop() || '';
  const invoice = invoices.find(i => i.id === id);
  const [payOpen, setPayOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="p-6">
        <EmptyState icon={<Receipt className="h-5 w-5" />} title="Invoice not found" description="It may have been deleted."
          action={<Button size="sm" onClick={() => navigate('/customers/invoices')}>Back to Invoices</Button>} />
      </div>
    );
  }

  const settled = invoice.balance <= 0.01;

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[
          { label: 'Customers', onClick: () => navigate('/customers') },
          { label: 'Invoices', onClick: () => navigate('/customers/invoices') },
          { label: invoice.number },
        ]} />}
        title={invoice.number}
        description={`${invoice.customerCompany} • issued ${formatDate(invoice.issueDate)} • due ${formatDate(invoice.dueDate)}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => navigate('/customers/invoices')}>Back</Button>
            <Button variant="outline" size="sm" leftIcon={<Printer className="h-3.5 w-3.5" />} onClick={() => window.print()}>Print</Button>
            {invoice.status === 'draft' && (
              <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={() => sendInvoice(invoice.id)}>Send Invoice</Button>
            )}
            {!settled && invoice.status !== 'draft' && invoice.status !== 'cancelled' && (
              <Button size="sm" leftIcon={<CreditCard className="h-3.5 w-3.5" />} onClick={() => setPayOpen(true)}>Record Payment</Button>
            )}
            {invoice.status !== 'cancelled' && !settled && (
              <Button variant="outline" size="sm" leftIcon={<Ban className="h-3.5 w-3.5" />} onClick={() => cancelInvoice(invoice.id)}>Cancel</Button>
            )}
          </div>
        }
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Amount Payable" value={formatCurrency(invoice.amountDue)} tone="gray" />
          <Stat label="Paid" value={formatCurrency(invoice.amountPaid)} tone="green" />
          <Stat label="Balance" value={formatCurrency(invoice.balance)} tone={invoice.balance > 0 ? 'red' : 'green'} />
          <Stat label="Status" value={invoice.status === 'part_paid' ? 'Part Paid' : invoice.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} tone="gray" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Line Items" subtitle={`${invoice.lines.length} lines`} />
            <CardBody className="p-0">
              <Table>
                <THead><tr><Th>Description</Th><Th>Qty</Th><Th>Unit Price</Th><Th>VAT</Th><Th>Amount</Th></tr></THead>
                <TBody>
                  {invoice.lines.map(line => (
                    <Tr key={line.id}>
                      <Td className="text-sm font-medium text-ink-900">{line.description}</Td>
                      <Td className="text-sm">{line.quantity}</Td>
                      <Td className="text-sm">{formatCurrency(line.unitPrice)}</Td>
                      <Td>{line.taxable ? <Badge tone="blue">VAT</Badge> : <Badge tone="gray">Exempt</Badge>}</Td>
                      <Td className="text-sm font-medium">{formatCurrency(line.quantity * line.unitPrice)}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
              <div className="border-t border-ink-200 p-5 space-y-2 bg-ink-50/40">
                <SummaryRow label="Subtotal" value={formatCurrency(invoice.subtotal)} />
                <SummaryRow label={`VAT (${(invoice.vatRate * 100).toFixed(1)}%)`} value={formatCurrency(invoice.vat)} />
                <SummaryRow label="Invoice Total" value={formatCurrency(invoice.total)} />
                {invoice.whtRate > 0 && (
                  <SummaryRow label={`Withholding Tax (${(invoice.whtRate * 100).toFixed(0)}%)`} value={`-${formatCurrency(invoice.wht)}`} tone="red" />
                )}
                <div className="flex items-center justify-between border-t border-ink-200 pt-2">
                  <span className="text-sm font-semibold text-ink-900">Amount Payable</span>
                  <span className="text-lg font-semibold text-ink-900">{formatCurrency(invoice.amountDue)}</span>
                </div>
                <SummaryRow label="Paid to date" value={formatCurrency(invoice.amountPaid)} tone="green" />
                <SummaryRow label="Balance" value={formatCurrency(invoice.balance)} tone={invoice.balance > 0 ? 'red' : 'green'} />
              </div>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Bill To" />
              <CardBody className="space-y-1.5">
                <p className="text-sm font-medium text-ink-900">{invoice.customerCompany}</p>
                <p className="text-xs text-ink-600">{invoice.customerName}</p>
                <p className="text-xs text-ink-500">{invoice.customerEmail}</p>
                <div className="pt-3 mt-3 border-t border-ink-200 space-y-1.5 text-xs">
                  <DetailRow label="Terms" value={`Net ${invoice.termsDays} days`} />
                  <DetailRow label="Issued" value={formatDate(invoice.issueDate)} />
                  <DetailRow label="Due" value={formatDate(invoice.dueDate)} />
                  {invoice.paidAt && <DetailRow label="Paid" value={formatDate(invoice.paidAt)} />}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Payments" subtitle={`${invoice.payments.length} recorded`} />
              <CardBody className="p-0">
                {invoice.payments.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-ink-500">No payments recorded yet.</div>
                ) : (
                  <ul className="divide-y divide-ink-100">
                    {invoice.payments.map(p => (
                      <li key={p.id} className="px-5 py-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-ink-900">{formatCurrency(p.amount)}</p>
                          <p className="text-[11px] text-ink-500 capitalize">{p.method.replace('_', ' ')} • {p.reference}</p>
                        </div>
                        <span className="text-[11px] text-ink-500">{formatDate(p.date)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>

            {invoice.notes && (
              <Card>
                <CardHeader title="Notes" />
                <CardBody><p className="text-xs text-ink-600 leading-relaxed">{invoice.notes}</p></CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>

      <RecordPaymentModal
        open={payOpen}
        invoice={invoice}
        onClose={() => setPayOpen(false)}
        onSubmit={payment => { recordInvoicePayment(invoice.id, payment); setPayOpen(false); }}
      />
    </div>
  );
}

function RecordPaymentModal({ open, invoice, onClose, onSubmit }: {
  open: boolean;
  invoice: Invoice;
  onClose: () => void;
  onSubmit: (p: { amount: number; date: string; method: 'bank_transfer' | 'card' | 'cash' | 'cheque'; reference: string; note?: string }) => void;
}) {
  const [amount, setAmount] = useState(String(Math.round(invoice.balance)));
  const [date, setDate] = useState(today());
  const [method, setMethod] = useState<'bank_transfer' | 'card' | 'cash' | 'cheque'>('bank_transfer');
  const [reference, setReference] = useState('');
  const [seeded, setSeeded] = useState(invoice.id);

  // Default the amount to whatever is still outstanding each time it opens.
  if (open && seeded !== invoice.id) {
    setSeeded(invoice.id);
    setAmount(String(Math.round(invoice.balance)));
  }

  const value = Number(amount) || 0;
  const valid = value > 0 && value <= invoice.balance + 0.01 && reference.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Payment"
      description={`${invoice.number} • ${formatCurrency(invoice.balance)} outstanding`}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" disabled={!valid} leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            onClick={() => onSubmit({ amount: value, date, method, reference: reference.trim() })}>
            Record Payment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Amount Received">
          <Input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)} />
          {value > invoice.balance + 0.01 && <p className="text-[11px] text-red-600 mt-1">Cannot exceed the {formatCurrency(invoice.balance)} balance.</p>}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Payment Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
          <Field label="Method">
            <Select value={method} onChange={e => setMethod(e.target.value as typeof method)}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </Select>
          </Field>
        </div>
        <Field label="Reference">
          <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. TRF-889201" />
        </Field>
        <div className="rounded-md bg-ink-50 border border-ink-200 p-3 text-xs text-ink-600">
          Remaining balance after this payment: <span className="font-semibold text-ink-900">{formatCurrency(Math.max(0, invoice.balance - value))}</span>
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ helpers

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: 'red' | 'green' }) {
  const color = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-700' : 'text-ink-900';
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-600">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-900 font-medium">{value}</span>
    </div>
  );
}
