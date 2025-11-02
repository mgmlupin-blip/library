async function buscarLibroOnline(titulo) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titulo)}`);
  const data = await res.json();
  mostrarResultadosBusqueda(data.items || []);
}

function mostrarResultadosBusqueda(resultados) {
  const cont = document.createElement("div");
  cont.id = "resultados-busqueda";
  cont.innerHTML = "<h2>Resultados:</h2>";

  resultados.forEach(item => {
    const info = item.volumeInfo;
    const card = document.createElement("div");
    card.className = "resultado-libro";

    const img = document.createElement("img");
    img.src = info.imageLinks?.thumbnail || "sin_portada.png";
    card.appendChild(img);

    const titulo = document.createElement("h3");
    titulo.textContent = info.title || "Sin título";
    card.appendChild(titulo);

    const autor = document.createElement("p");
    autor.textContent = (info.authors || ["Autor desconocido"]).join(", ");
    card.appendChild(autor);

    const btn = document.createElement("button");
    btn.textContent = "Guardar en mi biblioteca";
    btn.onclick = async () => {
      const libro = {
        nombre: info.title,
        autor: (info.authors || ["Autor desconocido"]).join(", "),
        imagen: info.imageLinks?.thumbnail || "",
        fpublicacion: info.publishedDate || "",
        editorial: info.publisher || "",
        sinopsis: info.description || "",
        puntuación: 0,
        saga: "",
        comprado: false,
        comprar: false
      };
      await guardarLibroFirebase(libro);
      alert("📚 Libro guardado en la biblioteca online");
    };
    card.appendChild(btn);
    cont.appendChild(card);
  });

  document.body.appendChild(cont);
}

async function guardarLibroFirebase(libro) {
  const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
  await addDoc(collection(window.db, "libros"), libro);
}
