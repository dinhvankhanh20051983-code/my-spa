export const fmt = (val) => {
  if (val === undefined || val === null) return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(val) + " đ";
};

export const calcSal = (emp) => {
  if (!emp || !emp.salary) return { total: 0 };
  const { salary, cfg = {}, md = {} } = emp;
  const tourAmt = (md.tours || 0) * (cfg.tourFee || 0);
  const prodCom = (md.prodSales || 0) * ((cfg.prodPct || 0) / 100);
  const pkgCom = (md.pkgSales || 0) * ((cfg.pkgPct || 0) / 100);
  const gross = salary + tourAmt + prodCom + pkgCom + (cfg.lunch || 0) + (md.other || 0);
  const net = gross - (salary * (cfg.bhxhPct || 0) / 100) - (gross * (cfg.tncnPct || 0) / 100);
  return { ...md, tourAmt, prodCom, pkgCom, gross, total: net };
};