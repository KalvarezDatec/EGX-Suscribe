// 'use strict';
// const axios = require('axios');
// /**
//  * installment controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::installment.installment', ({ strapi }) => ({

//   async createInstallment(ctx) {
//     const { idpedido, installments } = ctx.request.body;

//     let pedido = await strapi.db.connection.raw(`
//     Select T1.id,T1.idorder,T2.id idpedidocontrato,T2.pedido_id,T2.contrato_id
//      from pedidos T1
//     join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
//     where T1.idorder=${idpedido}`);
//     if (pedido.rowCount != 0) {
//       let contrato = await strapi.db.connection.raw(`
//       Select *
//       from installments_suscripcione_links
//       where contrato_id=${pedido.rows[0].contrato_id}`);
//       if (contrato.rowCount == 0) {
//         for (let i = 0; i < installments.length; i++) {
//           const fecha = new Date(installments[i].scheduledDate);
//           console.log(fecha.toISOString())
//           const dataInstallment = {
//             idinstallment: installments[i].id,
//             amount: installments[i].amount,
//             scheduledDate: fecha.toISOString(),
//             suscripcione: pedido.rows[0].contrato_id,
//             status: 2,
//             pedido: (i == 0) ? pedido.rows[0].id : null
//           }
//           await strapi.db.query("api::installment.installment").create({ data: dataInstallment });
//         }

//         return {
//           status: 200,
//           idcontrato: pedido.rows[0].contrato_id
//         }
//       } else {
//         return {
//           status: 404,
//           mensaje: "Installment repetidos no se puede ingresar."
//         }
//       }

//     } else {
//       return {
//         status: 409,
//         mensaje: "consfict: no existe ningun pedido y contrato"
//       }
//     }
//   },
//   async updateInstallment(ctx) {
//     const { idpedido, installmentId } = ctx.request.body;
//     let pedido = await strapi.db.connection.raw(`
//     Select T1.id,T1.idorder,T2.id idpedidocontrato,T2.pedido_id,T2.contrato_id,T1.nroorden
//      from pedidos T1
//     join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
//     where T1.idorder=${idpedido}`)
//     if (pedido.rowCount != 0) {
//       const idcontrato = pedido.rows[0].contrato_id;
//       let installment = await strapi.db.connection.raw(`
//       select T0.id from installments T0
//       join installments_suscripcione_links T1 on T1.installment_id=T0.id
//       where T1.contrato_id=${idcontrato} and T0.idinstallment=${installmentId}`)
//       await strapi.db.connection.raw(`UPDATE installments_status_links set status_id=1 where installment_id=${installment.rows[0].id}`);

//       let installmentSgte = await strapi.db.connection.raw(`
//       select T0.id,T0.scheduled_date fecha from installments T0
//       join installments_suscripcione_links T1 on T1.installment_id=T0.id
//       where T1.contrato_id=${idcontrato} and T0.idinstallment=${installmentId + 1}`)
//       console.log("installmentSgte.rowCount[0]",installmentSgte.rows)
//       if (installmentSgte.rowCount != 0) {
//         const fecha = new Date(installmentSgte.rows[0].fecha);
//           const año = fecha.getFullYear();
//           const mes = fecha.getMonth() + 1;
//           const dia = fecha.getDate();
//           const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
//         await strapi.db.connection.raw(`UPDATE contratoes set fechapago='${fechaFormateada}' where id=${idcontrato}`);
//       }

//       if (installmentId == 1) {
//         await strapi.db.connection.raw(`UPDATE contratoes_status_links set status_id=1 where contrato_id=${idcontrato}`);
//         return {
//           status: 200,
//           idpedido: idpedido,
//           order_number: pedido.rows[0].nroorden
//         }
//       }
//       const response = await clonarPedido(idpedido);
//       return response

//     } else {
//       return {
//         status: 409,
//         mensaje: "conflict"
//       }
//     }
//   }


// })
// );

// const clonarPedido = async (req) => {
//   const urlShopify = "https://dmall-bolivia.myshopify.com/admin/api/2023-04/orders.json"
//   const headers = {
//     "X-Shopify-Access-Token": "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",
//     'Content-Type': 'application/json'
//   }
//   const jsonOrden = await devolverJsonOrder(req);
//   if (jsonOrden.status == 200) {
//     const Payload = { order: jsonOrden.data };
//     console.log("Payload", Payload)
//     const response = await axios.post(urlShopify, Payload, { headers })
//       .then(response => {
//         console.log(response.data);
//         return {
//           status: response.status,
//           data: response.data.order.id
//         };
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         if (error.code == "ERR_BAD_REQUEST") {
//           return {
//             status: 422,
//             data: error.message
//           }
//         } else {
//           return {
//             status: 404,
//             data: error.message
//           }
//         }


//       });
//     return response;
//   } else {
//     return {
//       status: 404,
//       msg: "Not Found"
//     }
//   }



// }

// const devolverJsonOrder = async (req) => {
//   let pedido = await strapi.db.connection.raw(`
//   Select * from pedidos where idorder=${req}`);
//   if (pedido.rowCount != 0) {
//     const jsonOrder = JSON.parse(pedido.rows[0].jsonordern);
//     // console.log(jsonOrder)
//     // const customer = {
//     //   id: jsonOrder.customer.id
//     // }
//     // delete jsonOrder.customer
//     // jsonOrder.customer = customer;
//     console.log("jsonOrder", jsonOrder)
//     return {
//       status: 200,
//       data: jsonOrder
//     }
//   } else {
//     return {
//       status: 404,
//       data: ""
//     }
//   }


// }

'use strict';
const axios = require('axios');
/**
 * installment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::installment.installment', ({ strapi }) => ({

  async createInstallment(ctx) {
    const { idpedido, installments } = ctx.request.body;

    let pedido = await getPedido(idpedido);
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
            status: 6,
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
    let pedido = await getPedido(idpedido)
    if (pedido.rowCount != 0) {
      console.log(pedido.rows)
      const idcontrato = pedido.rows[0].contrato_id;
      let installment = await getInsatallment(idcontrato, installmentId);
      await strapi.db.connection.raw(`UPDATE installments_status_links set status_id=7 where installment_id=${installment.rows[0].id}`);
      let installmentSgte = await getInsatallment(idcontrato, installmentId + 1);
      if (installmentSgte.rowCount != 0) {
        const fecha = new Date(installmentSgte.rows[0].fecha);
        const año = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();
        const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
        await strapi.db.connection.raw(`UPDATE contratoes set fechapago='${fechaFormateada}' where id=${idcontrato}`);
      }

      if (installmentId == 1) {
        await strapi.db.connection.raw(`UPDATE contratoes_status_links set status_id=2 where contrato_id=${idcontrato}`);
        return {
          status: 200,
          idpedido: idpedido,
          order_number: pedido.rows[0].nroorden
        }
      }
      const response = await clonarPedido(idpedido);
      await crearPedidoStrapi(response, idcontrato);

      const idpedido2 = response.data.id;
      await updatedPedidoInstallment(idpedido2,installmentId);
      return {
        status:200,
        idpedido:idpedido2,
        order_number:response.data.name
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

const updatedPedidoInstallment = async (idpedido,installmentId) => {
  let pedido = await getPedido(idpedido)
  let insatallment = await getInsatallment(pedido.rows[0].contrato_id, installmentId);
console.log("pedidoI",pedido.rows[0])
  await strapi.db.connection.raw(`
  INSERT INTO installments_pedido_links( installment_id,pedido_id)values (${insatallment.rows[0].id},${pedido.rows[0].pedido_id})`);
}

const getPedido = async (idpedido) => {
  let pedido = await strapi.db.connection.raw(`
  Select T1.id,T1.idorder,T2.id idpedidocontrato,T2.pedido_id,T2.contrato_id,T1.nroorden
   from pedidos T1
  join pedidos_suscripcione_links T2 on T1.id=T2.pedido_id
  where T1.idorder=${idpedido}`)
  return pedido;
}
const getInsatallment = async (idcontrato, installmentId) => {
  console.log("idcontrato",idcontrato)
  const insatallment = await strapi.db.connection.raw(`
      select T0.id,T0.scheduled_date fecha from installments T0
      join installments_suscripcione_links T1 on T1.installment_id=T0.id
      where T1.contrato_id=${idcontrato} and T0.idinstallment=${installmentId}`)

  return insatallment;
}

const crearPedidoStrapi = async (req, idcontrato) => {
  console.log("req", req)
  const dataJsonOrder = {
    "line_items": req.data.line_items,
    "customer": req.data.customer,
    "tags": ["EGX Suscribe", "Club del café"],
    "shipping_address": req.data.shipping_address,
    "shipping_lines": req.data.shipping_lines
  }
  const dataPedido = {
    idorder: req.data.id,
    suscripcione: idcontrato,
    nroorden: req.data.name,
    jsonordern: dataJsonOrder
  }
  const pedido = await strapi.db.query("api::pedido.pedido").create({ data: dataPedido });

  return {
    status: 200,
    msg: "ok"
  }
}

const clonarPedido = async (req) => {
  const urlShopify = "https://elgeniox-staging.myshopify.com/admin/api/2023-04/orders.json"
  const headers = {
    "X-Shopify-Access-Token": "env('shopify_token')",
    'Content-Type': 'application/json'
  }
  const jsonOrden = await devolverJsonOrder(req);
  if (jsonOrden.status == 200) {
    const Payload = { order: jsonOrden.data };
    console.log("Payload", Payload)
    const response = await axios.post(urlShopify, Payload, { headers })
      .then(response => {
        console.log(response.data);
        return {
          status: response.status,
          data: response.data.order
        };
      })
      .catch(error => {
        console.error('Error:', error);
        if (error.code == "ERR_BAD_REQUEST") {
          return {
            status: 422,
            data: error.message
          }
        } else {
          return {
            status: 404,
            data: error.message
          }
        }


      });
    return response;
  } else {
    return {
      status: 404,
      msg: "Not Found"
    }
  }



}

const devolverJsonOrder = async (req) => {
  let pedido = await strapi.db.connection.raw(`
  Select * from pedidos where idorder=${req}`);
  if (pedido.rowCount != 0) {
    const jsonOrder = JSON.parse(pedido.rows[0].jsonordern);
    // console.log(jsonOrder)
    // const customer = {
    //   id: jsonOrder.customer.id
    // }
    // delete jsonOrder.customer
    // jsonOrder.customer = customer;
    console.log("jsonOrder", jsonOrder)
    return {
      status: 200,
      data: jsonOrder
    }
  } else {
    return {
      status: 404,
      data: ""
    }
  }


}
