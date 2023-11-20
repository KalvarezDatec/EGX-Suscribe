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

    // const entry = await strapi.db.connection.raw(`
    // select T5.product[0]->>'nombre' descProd,
    // T5.product[0]->'imagen'->0->>'url' imagen,
    // T1.id idcus,T1.idcustomer,T1.firstname,T1.lastname,T1.correoelectronico,
    // T3.id idcontrato,T3.inital_date,T3.end_date,T3.fechapago,
    // T7.title frecuencia,T7.descripcion,
    // T9.title estado,T3.fechapago sgtefecha
    // from customers T1
    // join contratoes_customer_links T2 on T1.id=T2.customer_id
    // join contratoes T3 on T3.id=T2.contrato_id
    // join contratoes_suscription_links T4 on T4.contrato_id=T3.id
    // join suscriptions T5 on T5.id=T4.suscription_id
    // join contratoes_frecuencia_links T6 on T6.contrato_id=T3.id
    // join frecuencias T7 on T7.id=T6.frecuencia_id
    // join contratoes_status_links T8 on T8.contrato_id=T3.id
    // join statuses T9 on T8.status_id=T9.id
    // where T1.idcustomer=${id}`)
    const entry = await strapi.db.connection.raw(`

select T0.*,T1.total from
(
SELECT
    T5.product[0]->>'nombre' AS descProd,
    T5.product[0]->'imagen'->0->>'url' AS imagen,
    T1.id AS idcus,
    T1.idcustomer,
    T1.firstname,
    T1.lastname,
    T1.correoelectronico,
    T3.id AS idcontrato,
    T3.inital_date,
    T3.end_date,
    T3.fechapago,
    T7.title AS frecuencia,
    T7.descripcion,
    T9.title AS estado,
    T3.fechapago AS sgtefecha
FROM
    customers T1
    JOIN contratoes_customer_links T2 ON T1.id = T2.customer_id
    JOIN contratoes T3 ON T3.id = T2.contrato_id
    JOIN contratoes_suscription_links T4 ON T4.contrato_id = T3.id
    JOIN suscriptions T5 ON T5.id = T4.suscription_id
    JOIN contratoes_frecuencia_links T6 ON T6.contrato_id = T3.id
    JOIN frecuencias T7 ON T7.id = T6.frecuencia_id
    JOIN contratoes_status_links T8 ON T8.contrato_id = T3.id
    JOIN statuses T9 ON T8.status_id = T9.id
WHERE
    T1.idcustomer = ${id}
) T0
join
(
WITH RankedOrders AS (
    SELECT
        T0.id AS pedido_id,
        T1.contrato_id,
        (T0.jsonordern->'line_items'->0->>'price')::numeric AS total,
        ROW_NUMBER() OVER (PARTITION BY T1.contrato_id ORDER BY T0.id) AS rn
    FROM
        pedidos T0
        JOIN pedidos_suscripcione_links T1 ON T0.id = T1.pedido_id
        JOIN contratoes T2 ON T2.id = T1.contrato_id
        JOIN contratoes_customer_links T4 ON T2.id = T4.contrato_id
        JOIN customers T5 ON T5.id = T4.customer_id
    WHERE
        T5.idcustomer = ${id}
)
SELECT
    contrato_id  AS idcontrato,
	 total
FROM
    RankedOrders
WHERE
    rn = 1
) T1 on T0.idcontrato=T1.idcontrato`)
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
