

'use strict';

/**
 * suscription controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::suscription.suscription', ({ strapi }) => ({

  async createSuscriptor(ctx) {
    console.log(ctx.request.body.data)
    const { product } = ctx.request.body.data;
    const id = product[0].id.replace('gid://shopify/Product/', '');
    const idvariant = product[0].idvariant.replace('gid://shopify/ProductVariant/', '');
    ctx.request.body.data.product[0].id = id;
    ctx.request.body.data.product[0].idvariant = idvariant;
    // console.log(ctx.request.body.data)
    // const model = strapi.contentType["api::suscription.suscription"];
    // console.log("model", model);
    // const data = ctx.request.body.data
    // const validData = await strapi.entityValidator.validateEntityCreation(model, data);
    // console.log("validData", validData);
    const existe = await strapi.db.connection.raw(`select * from suscriptions
    where product[0]->>'id'='${id}'
    and  product[0]->>'idvariant'='${idvariant}'`)
    if (existe.rowCount == 0) {
      const entry = await strapi.db.query("api::suscription.suscription").create(ctx.request.body)
      return {
        status: 200,
        mensaje: "Se creo corractamente Suscription",
        data: entry
      }
    }
    return {
      status: 409,
      mensaje: "conflict: Ya se encuentra registrado la Suscripcion",
      data: ctx.request.body
    }
  },

  async getSuscriptorPrd(ctx) {
    const { idprod, idvariant } = ctx.request.body;

    const entry = await strapi.db.connection.raw(`select * from suscriptions where product[0]->>'id'='${idprod}' and  product[0]->>'idvariant'='${idvariant}'`)
    const prd = entry.rows[0].product;
    entry.rows[0].product = JSON.parse(prd);
    return entry.rows[0];
  }

})
);
