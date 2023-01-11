// let test1 = document.getElementById('test1')
// let test2 = document.getElementById('test2')
// let test3 = document.getElementById('test3')


// test1.addEventListener("change", () => {
//     console.log(test1.value);
// })

// test2.addEventListener("change", () => {
//     console.log(test2.value);
// })

// test3.addEventListener("change", () => {
//     console.log(test3.value);
// })

let botonEnviar = document.getElementById('botonEnviar')

let arr=[]
let arr2=[]
let arr3=[]
var data=[]
var i=0, sum=0, sum2=0;

botonEnviar.addEventListener('click', () => {
    let selects = document.querySelectorAll('select')
    selects.forEach(select => {
        if (select.value>0)
            arr.push(parseInt(select.value))
            if (parseInt(select.value) > 0 && parseInt(select.value) < 4)
                arr2.push(parseInt(select.value))
            else if (parseInt(select.value) >= 4 && parseInt(select.value) < 7)
                arr2.push(parseInt(select.value)+2)
            else if (parseInt(select.value) >= 7 && parseInt(select.value) < 9)
                arr2.push(parseInt(select.value)+1)
            else if (parseInt(select.value) == 9)
                arr2.push(parseInt(select.value)+1)
            else if (parseInt(select.value) == 10)
                arr2.push(parseInt(select.value))
    });

    console.log(arr);
    console.log(arr2);
    calculate();
    info(arr3);
    removeData(myChart)
    addData(myChart,'Probabilidad de impacto', arr3[0])
    addData(myChart,'Severidad del impacto', arr3[1])
    addData(myChart,'Criticidad final', arr3[2])
    arr3=[]
    
})

const ctx = document.getElementById('myChart');

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Probabilidad de impacto','Severidad del impacto','Criticidad final'],
      datasets: [{
        label: 'Promedio',
        data: [0,0,0],
        fill: true,
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }]
    },
    options: {
        responsive: true
    }
  });

function calculate(){
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
        sum2 += arr2[i];
    }
    var avg = sum / arr.length;
    arr3.push(avg)
    var avg2 = sum2 / arr.length;
    arr3.push(avg2)
    var avg3 = (avg+avg2)/2;
    arr3.push(avg3)
    console.log(arr3);
    console.log(avg);
    console.log(avg2);
    console.log(avg3);
    sum=0
    sum2=0
    avg=0
    avg2=0
    avg3=0
    arr=[]
    arr2=[]
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });

    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });

    chart.update();
}

function removeData(chart, val) {
    // Delete entry from the database
    delete data[val];

    // Re-populate and re-render the chart
    chart.data.labels = Object.keys(data);
    chart.data.datasets.forEach((dataset) => {
        dataset.data = Object.values(data);
    });

    chart.update();
}


function updateChart(chart, dataObj) {
    // Store data into the database
    Object.assign(data, dataObj);

    // Fetch data from the database and replace old data
    chart.data.labels = Object.keys(data);
    chart.data.datasets.forEach((dataset) => {
        dataset.data = Object.values(data);
    });

    chart.update();
}

function info(arr3){
    var box = document.createElement('div');
    box.style.width = '1000px';
    box.style.height = '100px';
    box.style.backgroundColor = '#FFB6C1';  /* rosa claro */
    //box.style.backgroundColor = '#FFFFE0';  /* amarillo claro */
    //box.style.backgroundColor = '#FFA07A';  /* naranja claro */
    box.style.border = '1px solid black';
    box.style.borderRadius = '5px';
    box.style.margin = 'auto';
    box.style.textAlign = 'center';
    box.style.position = 'absolute';
    box.style.right = '0';
    box.style.left = '0';
    box.style.lineHeight = '100px';
    if (arr3[2] > 0 && arr3[2] < 4)
        box.innerHTML = 'La PYME cuenta con un correcto cumplimiento de controles en seguridad de la información';
    else if (arr3[2] >= 4 && arr3[2] < 7)
        box.innerHTML = 'La PYME cuenta con una exposición media en relación a los cumplimientos de controles en seguridad de la información';
    else if (arr3[2] >= 7 && arr3[2] < 9)
        box.innerHTML = 'La PYME se encuentra con una exposición alta, debido a los bajos cumplimientos de controles en seguridad de la información';
    else if (arr3[2] >= 9 && arr3[2] <= 10)
        box.innerHTML = 'La PYME se encuentra con una exposición crítica, pues no cuenta con los controles necesarios en seguridad de la información';
    else
        box.innerHTML = 'La PYME no cumple los requisitos para una evaluación de riesgos';
    document.body.appendChild(box);
}

