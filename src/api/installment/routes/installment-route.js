module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-installment",
      handler: "installment.createInstallment"
    },
    {
      method: "POST",
      path: "/update-installment",
      handler: "installment.updateInstallment"
    },
  ]
}
