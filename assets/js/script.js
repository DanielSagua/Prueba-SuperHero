$(document).ready(function (){
    $('#btn').click(function (error){
        error.preventDefault();
        var num = parseInt($('#idHero').val());
        var isnum = /^[0-9]+$/;
        //Validacion
        if (isnum.test(num)) {
            $('#idHero').val("");
            $('#resultado').html("");
            $('#grafico').html("");
            queHeroe(num);
        }
        else {
            alert('Por favor ingrese un numero');
        }
    });
    function queHeroe(num){
        $.ajax({
            dataType: "json",
            method: "GET",
            url: `https://superheroapi.com/api.php/2619421814940190/${num}`,
            success: function(resultado){
                if (resultado.response === "success"){
                    displayHero(resultado);
                    displayStats(resultado);
                }
                else{
                    alert("No se encontro superHero con ese numero");
                }
            },

            error: function (error) {
                console.error(error);
                alert("Ocurrió un error al procesar la solicitud");
            }
        })
    }

    function displayHero(heroData){
        var hero = crearHeroe(heroData);
        $('#resultado').html(hero);
        bioInfo(heroData);
    }

    function crearHeroe(heroData){
        return `
        <section class="card">
        <h3 class="text-center">Super Heroe Encontrado</h3>
            <section class="row">
                <section class="col-md-4 pt-5">
                    <img src="${heroData.image.url}" class="card-img ps-3 pt-2" alt="" />
                </section>
                <section class="col-md-8">
                    <section class="card-body ps-1">
                        <h5 class="card-title">Nombre: ${heroData.name}</h5>
                        <p class="card-text">Conexiones: ${heroData.connections["group-affiliation"]}</p>
                        <ul class="list-group" id="heroInfoList"></ul>
                    </section>
                </section>
            </section>
        </section>
        `
    }

    function bioInfo (heroData){
        var listaInfo = [
            {label: "publicado por", value: heroData.biography.publisher},
            {label: "Ocupacion", value: heroData.work.occupation},
            {label: "Primera aparicion", value: heroData.biography["first-appearance"]},
            {label: "Altura", value: heroData.appearance.height.join(" - ")},
            {label: "Peso", value: heroData.appearance.weight.join(" - ")},
            {label: "Aliases", value: heroData.biography.aliases.join(", ")}
        ];
        var listHtml = listaInfo.map(item => `<li class="list-group-item><em>${item.label}</em>: ${item.value}</li>`).join("");
        $("#heroInfoList").html(listHtml);
    }

    function displayStats(heroData){
        let graf = [];
        for(let key in heroData.powerstats){
            graf.push({
                label: key,
                y: parseInt(heroData.powerstats[key]),
            })
        }
        let options = {
            title: {
                text: `Estadisticas de poder para ${heroData.name}`,
            },
            data: [{
                type: "pie",
                startAngle: 35,
                showInLegend: true,
                legendText: "{label}",
                indexLabel: "{label} ({y})",
                yValueFormatString: "#,##0.#",
                dataPoints: graf,
            }],
        }
        $('#grafico').CanvasJSChart(options);
    }

})