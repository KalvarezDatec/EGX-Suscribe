'use strict';

/**
 * installment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::installment.installment', ({ strapi }) => ({

  async createInstallment(ctx) {
    const { idpedido, installments } = ctx.request.body;

    let pedido = await strapi.db.connection.raw(`
    Select T1.id,T1.idorder,T2.id idpedidocontrato,T2.pedido_id,T2.contrato_id
     from pedidos T1
    join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
    where T1.idorder=${idpedido}`);
    if (pedido.rowCount != 0) {
      let contrato = await strapi.db.connection.raw(`
      Select *
      from installments_suscripcione_links
      where contrato_id=${pedido.rows[0].contrato_id}`);
      if (contrato.rowCount == 0) {
        for (let i = 0; i < installments.length; i++) {
          const fecha = new Date(installments[i].scheduledDate);
          console.log(fecha.toISOString())
          const dataInstallment = {
            idinstallment: installments[i].id,
            amount: installments[i].amount,
            scheduledDate: fecha.toISOString(),
            suscripcione: pedido.rows[0].contrato_id,
            status: 2,
            pedido: (i == 0) ? pedido.rows[0].id : null
          }
          await strapi.db.query("api::installment.installment").create({ data: dataInstallment });
        }

        return {
          status: 200,
          idcontrato: pedido.rows[0].pedido_id
        }
      } else {
        return {
          status: 404,
          mensaje: "Installment repetidos no se puede ingresar."
        }
      }

    } else {
      return {
        status: 409,
        mensaje: "consfict: no existe ningun pedido y contrato"
      }
    }
  },
  async updateInstallment(ctx) {
    const { idpedido, installmentId } = ctx.request.body;
    let pedido = await strapi.db.connection.raw(`
    Select T1.id,T1.idorder,T2.id idpedidocontrato,T2.pedido_id,T2.contrato_id
     from pedidos T1
    join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
    where T1.idorder=${idpedido}`)
    if (pedido.rowCount != 0) {
      const idcontrato = pedido.rows[0].contrato_id;
      let installment = await strapi.db.connection.raw(`
      select T0.id from installments T0
      join installments_suscripcione_links T1 on T1.installment_id=T0.id
      where T1.contrato_id=${idcontrato} and T0.idinstallment=${installmentId}`)
      await strapi.db.connection.raw(`UPDATE installments_status_links set status_id=1 where installment_id=${installment.rows[0].id}`);

      let installmentSgte = await strapi.db.connection.raw(`
      select T0.id,T0.scheduled_date fecha from installments T0
      join installments_suscripcione_links T1 on T1.installment_id=T0.id
      where T1.contrato_id=${idcontrato} and T0.idinstallment=${installmentId + 1}`)
      console.log("installmentSgte.rowCount[0]",installmentSgte.rows)
      if (installmentSgte.rowCount != 0) {
        const fecha = new Date(installmentSgte.rows[0].fecha);
          const año = fecha.getFullYear();
          const mes = fecha.getMonth() + 1;
          const dia = fecha.getDate();
          const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
        await strapi.db.connection.raw(`UPDATE contratoes set fechapago='${fechaFormateada}' where id=${idcontrato}`);
      }

      if (installmentId == 1) {
        await strapi.db.connection.raw(`UPDATE contratoes_status_links set status_id=1 where contrato_id=${idcontrato}`);
        return {
          status: 200,
          idpedido: 9716329172639721,
          order_number: 1204
        }
      }
      return {
        status: 200,
        msg: "se creo pedido"
      }

    } else {
      return {
        status: 409,
        mensaje: "conflict"
      }
    }
  }


})
);
