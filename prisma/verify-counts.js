const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
Promise.all([
    p.user.count(),
    p.complaint.count(),
    p.notification.count(),
    p.remark.count(),
    p.state.count(),
    p.district.count(),
    p.city.count(),
    p.ward.count(),
    p.department.count(),
    p.auditLog.count(),
    p.budgetForecast.count(),
    p.budgetActual.count(),
    p.costOptimization.count(),
    p.demandSurge.count(),
]).then(([u, c, n, r, st, di, ci, w, de, al, bf, ba, co, ds]) => {
    console.log('=== DB COUNTS ===');
    console.log('Users         :', u);
    console.log('Complaints    :', c);
    console.log('Notifications :', n);
    console.log('Remarks       :', r);
    console.log('States        :', st);
    console.log('Districts     :', di);
    console.log('Cities        :', ci);
    console.log('Wards         :', w);
    console.log('Departments   :', de);
    console.log('AuditLogs     :', al);
    console.log('BudgetForecasts:', bf);
    console.log('BudgetActuals :', ba);
    console.log('CostOpts      :', co);
    console.log('DemandSurges  :', ds);
    p.$disconnect();
}).catch(e => { console.error(e); p.$disconnect(); });
