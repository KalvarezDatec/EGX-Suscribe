'use strict';

/**
 * contrato controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contrato.contrato', ({ strapi }) => ({

  async ObtenerPedido(ctx) {
    const { id } = ctx.params;
    console.log("id:", id)
    console.log(ctx.params)
    /*select T5.product[0]->>'nombre' descProd,

T1.id idcus,T1.idcustomer,T1.firstname,T1.lastname,T1.correoelectronico,
T3.id idcontrato,T3.inital_date,T3.end_date,T3.fechapago
from customers T1
join contratoes_customer_links T2 on T1.id=T2.customer_id
join contratoes T3 on T3.id=T2.contrato_id
join contratoes_suscription_links T4 on T4.contrato_id=T2.id
join suscriptions T5 on T5.id=T4.suscription_id
where T1.idcustomer=*/

    const entry = await strapi.db.connection.raw(`select T5.product[0]->>'nombre' descProd,
    T1.id idcus,T1.idcustomer,T1.firstname,T1.lastname,T1.correoelectronico,
    T3.id idcontrato,T3.inital_date,T3.end_date,T3.fechapago,
    T7.title frecuencia,T7.descripcion
    from customers T1
    join contratoes_customer_links T2 on T1.id=T2.customer_id
    join contratoes T3 on T3.id=T2.contrato_id
    join contratoes_suscription_links T4 on T4.contrato_id=T2.id
    join suscriptions T5 on T5.id=T4.suscription_id
    join contratoes_frecuencia_links T6 on T6.contrato_id=T3.id
    join frecuencias T7 on T7.id=T6.frecuencia_id
    where T1.idcustomer=${id}`)
    if (entry.rowCount != 0) {
      return {
        status: 200,
        data: entry.rows
      }
    }
    return {
      status: 200,
      data: []
    }
    // const prd = entry.rows[0].product;
    // entry.rows[0].product = JSON.parse(prd);
  }
})
);
