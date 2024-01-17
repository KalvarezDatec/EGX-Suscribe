
module.exports={
  routes:[{
    method:"GET",
    path:"/obtenerPedidos/:id",
    handler:"contrato.ObtenerPedido"
  },
  {
    method:"POST",
    path:"/ObtenerDetalleSus",
    handler:"contrato.ObtenerDetalleSus"
  }


  ]
}
