'use strict';

/**
 * customer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


const validar = async (req) => {
  // console.log("req", req)
  // console.log("idpedido:", req.idpedido)
  let msg = "";
  if (req.id == undefined || req.id == "") {
    // console.log(req.idpedido)
    msg = msg + "id/";
    // console.log("msg", msg)
  }
  if (req.customer == undefined) {
    msg = msg + "customer/";
  }
  // if (req.cantidad == undefined || req.cantidad == "") {
  //   msg = msg + "cantidad/";
  // }
  if (req.lineitems == undefined) {
    msg = msg + "lineitems/";
  }
  if (req.canal == undefined || req.canal == "") {
    msg = msg + "canal/";
  }
  if (req.fechacreacion == undefined || req.fechacreacion == "") {
    msg = msg + "fechacreacion/";
  }
  if (req.fechapago == undefined || req.fechapago == "") {
    msg = msg + "fechapago/";
  }
  if (req.estado == undefined || req.estado == "") {
    msg = msg + "estado/";
  }
  if (msg != "") {
    // console.log("msg", msg)
    return {
      status: 406,
      mensaje: "datos erroneos en el payload son: " + msg + " llegaron vacios o sin nada",
      body: req
    }
  } else {
    return {
      status: 200,
      mensaje: "",
      body: ""
    }
  }


}

module.exports = createCoreController('api::customer.customer', ({ strapi }) => ({

  async customerMember(ctx) {

    const { idcustomer, first_name, last_name, idsuscription } = ctx.request.body;
    const dataCustomer = {
      idcustomer,
      first_name,
      last_name
    };
    const date = new Date(); // Puedes usar tu propia fecha en lugar de la fecha actual.

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const dataMenber = {
      idcustomer,
      idsuscription,
      idstatus: 1,
      initalDate: formattedDate,
      publishedAt: new Date()
    }
    console.log("dataCustomer:", dataCustomer)
    const entryCustomer = await strapi.db.query("api::customer.customer").create({ data: dataCustomer })
    const entryMember = await strapi.db.query("api::contrato.contrato").create({ data: dataMenber })

    return {
      entryCustomer,
      entryMember
    }

  },
  async customerContract(ctx) {
    try {
      const validarok = await validar(ctx.request.body)
      if (validarok.status == 200) {


        const { id, customer, lineitems, inicio, fechapago } = ctx.request.body
        let idCustomer = 0;
        let existe = await strapi.db.connection.raw(`Select * from customers where idcustomer=${customer.id}`);
        // console.log(existe.rowCount)

        //console.log(existe.rows)
        if (existe.rowCount == 0) {
          const dataCustomer = {
            idcustomer: customer.id,
            firstname: customer.first_name,
            lastname: customer.last_name,
            correoelectronico: customer.email
          };
          //   console.log("dataCustomer", dataCustomer)
          const entryCustomer = await strapi.db.query("api::customer.customer").create({ data: dataCustomer });
          idCustomer = entryCustomer.id;
        } else {
          idCustomer = existe.rows[0].id;
        }
        //console.log("lineitems", lineitems[0].id)
        const suscription = await strapi.db.connection.raw(`select * from suscriptions where product[0]->>'id'='${lineitems[0].product_id}'
      and  product[0]->>'idvariant'='${lineitems[0].variant_id}'`)
        // console.log("suscription", suscription.rows[0])
        if (suscription.rowCount == 1) {
          const contrato = await strapi.db.connection.raw(`select T1.* from contratoes T1
        join contratoes_customer_links T2 on T1.id=T2.contrato_id
        join contratoes_suscription_links T3 on T1.id=T3.contrato_id
        join contratoes_status_links T4 on T1.id=T4.contrato_id
        where T3.suscription_id=${suscription.rows[0].id} and T2.customer_id=${idCustomer} and T4.status_id=1`);
          let idContrato = 0;
          // console.log("contrato", contrato.rows)
          if (contrato.rowCount == 0) {
            const dataContract = {
              customer: idCustomer,
              suscription: suscription.rows[0].id,
              status: 1,
              initalDate: inicio,
              pedido: fechapago,
              publishedAt: new Date()
            }
            const entryContrato = await strapi.db.query("api::contrato.contrato").create({ data: dataContract });
            idContrato = entryContrato.id;
          } else {
            idContrato = contrato.rows[0].id
          }
          const pedidos = await strapi.db.connection.raw(`select * from pedidos T1
        join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
        where T1.idorder=${id} and T2.contrato_id=${idContrato}`);
          // console.log("pedido", pedidos)
          if (pedidos.rowCount == 0) {
            const dataPedido = {
              idorder: id,
              suscripcione: idContrato
            }
            const pedido = await strapi.db.query("api::pedido.pedido").create({ data: dataPedido });
            return {
              status: 200,
              mensaje: "se registro correctamente",
              idContrato: pedido.id,
              publishedAt: new Date()
            }
          }
          return {
            status: 409,
            mensaje: "conflict: Pedido repetido no se puede ingresar."
          }

        } else {
          return {
            status: 404,
            mensaje: "Not found"
          }
        }
      } else {
        return validarok;
      }
    } catch (error) {
      return {
        status: 404,
        mensaje: error.message
      }
    }

    // return ctx.request.body;
  }

}));
