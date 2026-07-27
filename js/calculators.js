/* ==========================================================================
   LUIZ LEE REALTY - PROPERTY CALCULATORS SUITE
   Singapore BSD/ABSD Stamp Duty & Mortgage / Downpayment Calculator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCalcTabs();
  initBSDCalculator();
  initMortgageCalculator();
});

function initCalcTabs() {
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panels = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab') || btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      if (target) {
        document.getElementById(target)?.classList.add('active');
      }
    });
  });
}

function initBSDCalculator() {
  const priceInput = document.getElementById('bsd-price');
  const typeSelect = document.getElementById('bsd-type');
  const statusSelect = document.getElementById('bsd-status');
  const countSelect = document.getElementById('bsd-count');
  
  if (!priceInput) return;

  const calculate = () => {
    const price = parseFloat(priceInput.value) || 0;
    const type = typeSelect ? typeSelect.value : 'residential';
    const status = statusSelect.value; 
    const count = parseInt(countSelect.value) || 1; 

    // Calculate BSD (IRAS Tiered Rates)
    let bsd = 0;
    if (price <= 180000) bsd = price * 0.01;
    else if (price <= 360000) bsd = 1800 + (price - 180000) * 0.02;
    else if (price <= 640000) bsd = 5400 + (price - 360000) * 0.03;
    else if (price <= 1000000) bsd = 13800 + (price - 640000) * 0.04;
    else if (price <= 1500000) bsd = 28200 + (price - 1000000) * 0.05;
    else bsd = 53200 + (price - 1500000) * 0.06;

    // Calculate ABSD Rate
    let absdRate = 0;
    let statusLabel = "";

    if (type === 'commercial') {
      absdRate = 0;
      statusLabel = "Commercial / Industrial Property (No ABSD Applicable)";
    } else {
      if (status === 'sc' || status === 'fta') {
        if (count === 1) { absdRate = 0.0; statusLabel = "Singapore Citizen / FTA National (1st Property: 0% ABSD)"; }
        else if (count === 2) { absdRate = 0.20; statusLabel = "Singapore Citizen / FTA National (2nd Property: 20% ABSD)"; }
        else { absdRate = 0.30; statusLabel = "Singapore Citizen / FTA National (3rd+ Property: 30% ABSD)"; }
      } else if (status === 'pr') {
        if (count === 1) { absdRate = 0.05; statusLabel = "Permanent Resident (1st Property: 5% ABSD)"; }
        else if (count === 2) { absdRate = 0.30; statusLabel = "Permanent Resident (2nd Property: 30% ABSD)"; }
        else { absdRate = 0.35; statusLabel = "Permanent Resident (3rd+ Property: 35% ABSD)"; }
      } else if (status === 'foreigner') {
        absdRate = 0.60;
        statusLabel = "Foreigner Individual (60% ABSD)";
      } else if (status === 'entity') {
        absdRate = 0.65;
        statusLabel = "Entity / Corporate Buyer (65% ABSD)";
      }
    }

    const absd = price * absdRate;
    const totalDuty = bsd + absd;

    document.getElementById('res-bsd').textContent = 'S$ ' + Math.round(bsd).toLocaleString();
    document.getElementById('res-absd').textContent = 'S$ ' + Math.round(absd).toLocaleString();
    document.getElementById('res-total-duty').textContent = 'S$ ' + Math.round(totalDuty).toLocaleString();

    const breakdownBox = document.getElementById('calc-breakdown-text');
    if (breakdownBox) {
      breakdownBox.innerHTML = `<strong>Applicable Tax Summary:</strong> ${statusLabel}. Applied ABSD Rate: <span style="color: var(--gold-primary); font-weight: 700;">${(absdRate * 100).toFixed(0)}%</span> (S$ ${Math.round(absd).toLocaleString()}).`;
    }
  };

  priceInput.addEventListener('input', calculate);
  if (typeSelect) typeSelect.addEventListener('change', calculate);
  statusSelect.addEventListener('change', calculate);
  countSelect.addEventListener('change', calculate);

  calculate();
}

function initMortgageCalculator() {
  const priceInput = document.getElementById('mortgage-price') || document.getElementById('mortgage-loan');
  const ltvSelect = document.getElementById('mortgage-ltv');
  const tenureInput = document.getElementById('mortgage-tenure');
  const rateInput = document.getElementById('mortgage-rate');
  
  if (!priceInput) return;

  const calculate = () => {
    const price = parseFloat(priceInput.value) || 0;
    const ltvPct = ltvSelect ? parseFloat(ltvSelect.value) : 75;
    const years = parseFloat(tenureInput.value) || 25;
    const annualRate = parseFloat(rateInput.value) || 3.5;

    const loanAmt = price * (ltvPct / 100);
    const minDownpayment = price - loanAmt;
    const minCash = price * 0.05;
    const maxCpf = minDownpayment - minCash;

    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = years * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = loanAmt / totalPayments;
    }

    const totalInterest = (monthlyPayment * totalPayments) - loanAmt;

    document.getElementById('res-monthly-pay').textContent = 'S$ ' + Math.round(monthlyPayment).toLocaleString();
    if (document.getElementById('res-loan-amt')) {
      document.getElementById('res-loan-amt').textContent = 'S$ ' + Math.round(loanAmt).toLocaleString();
    }
    if (document.getElementById('res-downpayment')) {
      document.getElementById('res-downpayment').textContent = 'S$ ' + Math.round(minDownpayment).toLocaleString();
    }

    const breakdownBox = document.getElementById('mortgage-breakdown-text');
    if (breakdownBox) {
      breakdownBox.innerHTML = `<strong>Downpayment Breakdown:</strong> 5% Min Cash (S$ ${Math.round(minCash).toLocaleString()}) + ${(ltvPct === 75 ? 20 : 0)}% CPF/Cash (S$ ${Math.round(maxCpf).toLocaleString()}). Total Interest Payable over ${years} Years: S$ ${Math.round(totalInterest).toLocaleString()}.`;
    }
  };

  priceInput.addEventListener('input', calculate);
  if (ltvSelect) ltvSelect.addEventListener('change', calculate);
  tenureInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);

  calculate();
}
