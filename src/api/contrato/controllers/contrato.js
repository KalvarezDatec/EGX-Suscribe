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

    /*
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
) T1 on T0.idcontrato=T1.idcontrato*/
    const entry = await strapi.db.connection.raw(`
    WITH CustomerInfo AS (
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
  ),
  MaxMinDates AS (
      SELECT
          T4.contrato_id,
          CAST(MAX(T5.scheduled_date)::timestamp AS date) AS fechamax,
          CAST(MIN(T5.scheduled_date)::timestamp AS date) AS fechamin
      FROM
          customers T1
          JOIN contratoes_customer_links T2 ON T1.id = T2.customer_id
          JOIN contratoes T3 ON T3.id = T2.contrato_id
          JOIN installments_suscripcione_links T4 ON T4.contrato_id = T3.id
          JOIN installments T5 ON T5.id = T4.installment_id
      WHERE
          T1.idcustomer = ${id}
      GROUP BY
          T4.contrato_id
  )
  SELECT
      T0.*,
      T1.total,
      T2.fechamax,
      T2.fechamin
  FROM
      CustomerInfo T0
      JOIN (
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
              contrato_id AS idcontrato,
              total
          FROM
              RankedOrders
          WHERE
              rn = 1
      ) T1 ON T0.idcontrato = T1.idcontrato
      JOIN MaxMinDates T2 ON T0.idcontrato = T2.contrato_id;

`)
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
  },
  async ObtenerDetalleSus(ctx) {
    const { idSusc, idCliente } = ctx.request.body;
    const entry = await strapi.db.connection.raw(` select T1.contrato_id,CAST(max(T0.scheduled_date)::timestamp AS date)fechamax,CAST(min(T0.scheduled_date)::timestamp AS date)fechamin,T3.title,T3.descripcion
                  from installments T0
                  inner join installments_suscripcione_links T1 on T0.id=T1.installment_id
                  inner join contratoes_frecuencia_links T2 on T2.contrato_id=T1.contrato_id
                  inner join frecuencias T3 on T3.id=T2.frecuencia_id
                  where T1.contrato_id=${idSusc} group by T1.contrato_id,T3.title,T3.descripcion`)
    const costumer = await strapi.db.connection.raw(`select * from customers where idcustomer=${idCliente}`)
    const installement = await strapi.db.connection.raw(`select T0.id,T0.idinstallment,T0.amount,CAST((T0.scheduled_date)::timestamp AS date)scheduled_date,T4.title
    from installments T0
    inner join installments_suscripcione_links T1 on T0.id=T1.installment_id
    inner join installments_status_links T3 on T0.id=T3.installment_id
    inner join statuses T4 on T4.id=T3.status_id
    where T1.contrato_id=${idSusc}`);
    const direccionCliente = await strapi.db.connection.raw(`
    select
 TRIM(BOTH '"' FROM T0.jsonordern->'customer'->'default_address'->>'city'::text) as ciudad,
TRIM(BOTH '"' FROM T0.jsonordern->'customer'->>'first_name'::text)  as nombre,
TRIM(BOTH '"' FROM T0.jsonordern->'customer'->'default_address'->>'address1'::text)  as direccion,
TRIM(BOTH '"' FROM T0.jsonordern->'customer'->'default_address'->>'company'::text)  as latlong,
TRIM(BOTH '"' FROM T0.jsonordern->'customer'->'default_address'->>'phone'::text)  as telefono
from pedidos t0
inner join pedidos_suscripcione_links T1 on t0.id=T1.pedido_id
where T1.contrato_id=${idSusc}`)
    console.log(entry.rows[0])
    const payload = {
      suscripcion: {
        idsus: entry.rows[0].contrato_id,
        validez: `${(entry.rows[0].fechamin)} hasta ${(entry.rows[0].fechamax)}`,
        estado: await fechaActual(entry.rows[0].fechamax),
        envio: `${entry.rows[0].descripcion}`,
        metodoAPgo: "domiciliación"
      },
      cliente: {
        nombre: `${costumer.rows[0].firstname} ${costumer.rows[0].lastname}`,
        correo: costumer.rows[0].correoelectronico,
        celular: direccionCliente.rows[0].telefono
      },
      direccion: direccionCliente.rows[0],
      installement: installement.rows
    }

    return {
      status: 200,
      data: payload
    }
  }
}));
async function formatearFecha(fecha) {
  const fechaObjeto = new Date(fecha);

  const año = fechaObjeto.getFullYear();
  const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0'); // Sumar 1 porque los meses son indexados desde 0
  const dia = String(fechaObjeto.getDate()).padStart(2, '0');

  const fechaFormateada = `${año}-${mes}-${dia}`;
  return fechaFormateada
}

async function fechaActual(fechafin) {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1; // Meses están indexados desde 0, por lo que sumamos 1
  const dia = fechaActual.getDate();

  const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  console.log(fechaFormateada);
  const fecha1 = new Date(fechaFormateada);
  const fecha2 = new Date(fechafin);

  // Comparación
  if (fecha2 >= fecha1) {
    return "activo"
  } else {
    return "desactivado"
  }
}
