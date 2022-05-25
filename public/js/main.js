let socket = io.connect();

socket.on("messages", (data) => {
  renderMessages(data);
});

const showData = () => {
  const route = '/api/productos';
  fetch(route).then((res) => res.json()).then((data) =>{
    if(data.user) {
      let html = `
        <table class="table table-dark">
          <thead><tr style="color: yellow;"> <th>Email</th> <th>Nombre</th> <th>Dirección</th> <th>Edad</th> <th>Teléfono</th> </tr></thead><tbody>
          <tr><td>${data.user.username}</td><td>${data.user.name}</td><td>${data.user.address}</td><td>${data.user.age}</td><td>${data.user.phone}</td>
        </tbody></table>
        <a href="/api/logout">Salir</a>
      `;
      document.getElementById('session').innerHTML = html;
    }
    else {
      let html = `<a href="/login.html">Inicia sesión</a> o <a href="/register.html">Registrate</a>`;
      document.getElementById('session').innerHTML = html;
    }
    if (data.productos) {
      let html = `
        <table class="table table-dark">
          <thead><tr style="color: yellow;"> <th>Nombre</th> <th>Descripcion</th> <th>Código</th> <th>Foto</th> <th>Precio</th> <th>Stock</th> </tr></thead><tbody>
      `;
      for (let producto of data.productos) {
        let id = producto.id
        html += `<tr><td>${producto.title}</td><td>${producto.description}</td><td>${producto.code}</td><td><img src="${producto.thumbnail}" alt="Imagen del producto"></td><td>${producto.price}</td><td>${producto.stock}</td>`;
      }
      html += `</tbody></table>`;
      document.getElementById('productList').innerHTML = html;
    }
  }).catch((error) => console.log(error));
}

function renderMessages(data) {
  let html = data
    .map((elem, index) => {
      return `<div>
        <span style="color: blue; font-weight: bold;">${elem.author}</span>
        <span style="color: brown;">[${elem.date}]:</span>
        <span style="color: green; font-style: italic;">${elem.message}</span>
      </div>`;
    })
    .join(" ");
    document.getElementById("messages").innerHTML = html;
}

function addMessage(e) {
  let message = {
    author: document.getElementById("author").value, 
    message: document.getElementById("message").value,
    date: formatDate()
  };
  socket.emit("new-message", message); // new-message es el nombre del evento (recordatorio)
  document.getElementById("message").value = "";
  document.getElementById("message").focus();
  return false;
}

const formatDate = () => {
  let date = new Date();
  let formatted_date = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(
    -2
  )}/${date.getFullYear()} ${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
  return formatted_date;
};

showData()