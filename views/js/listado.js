const tabla_pedidos = document.getElementById("tabla_pedidos");

const listarPedidos = () => {
    const lista_pedidos = fetch("/listarpedidos")
    .then(res => res.json())
    .catch(error => console.log(error))
    //.then(resp => resp);

    return lista_pedidos;
};

(async ()=>{
    const lista_pedidos = await listarPedidos();
    console.log("Lista Pedidos: ", lista_pedidos)
    //lista_pedidos.map(pedido => tabla_pedidos.innerHTML += `<tr><td>${pedido.id}</td><td>${pedido.fecha_pedido}</td><td>${pedido.vegetarianos}</td></tr>`)
})();
