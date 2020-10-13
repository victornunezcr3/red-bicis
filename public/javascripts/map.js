var map = L.map('main_map').setView([10.1954397, -83.8952308], 13);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result) {
        console.log(result);
        result.bicicletas.forEach(bici => {
            L.marker(bici.ubicacion, { title: bici.id }).addTo(map);
        });
    }
});