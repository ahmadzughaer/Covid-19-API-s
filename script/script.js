const Covid_19URL = 'https://corona-api.com/countries';
const continentURL = 'https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1';
const continentInfo = {};
const coronaInfo = {};
let currentContinentInfo = [];
let currentData = 0;
let currentRegion;

async function getCountries() {
    try {
        let countriesData = await (await fetch(continentURL)).json()
        countriesData.forEach(el => {
            if (continentInfo[el.region]) {
                continentInfo[el.region] += `-${el.name.common}`
            } else {
                continentInfo[el.region] = `-${el.name.common}`;
            }
        })

        for (let [region, country] of Object.entries(continentInfo)) {
            continentInfo[region] = country.split('-');
        }
    }
    catch {
        console.error('there is an error')
    }
}


async function getCovidData() {
    try {
        let covidData = await (await fetch(Covid_19URL)).json()
        covidData.data.forEach(el => {
            coronaInfo[el.name] = [el.latest_data.confirmed, el.latest_data.recovered, el.latest_data.critical, el.latest_data.deaths]
        })
    }
    catch {
        console.error('there is an error')
    }
}

getCountries().then(() => {
    getCovidData()
})



let chart = document.getElementById('casesChart').getContext('2d'); 
let casesChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Covid-19 World Information',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                gridLines: {
                    display: false
                }
            }]
        }
    }
});

const  removeStats =(chart)=> { 
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
}

const addStats =(chart, label, data) => { 
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

const getDataByRegion = (region) => {
    currentContinentInfo = []
    continentInfo[region].forEach(el => {
        el && currentContinentInfo.push([el, coronaInfo[el]])
    })

    currentContinentInfo = Object.values(currentContinentInfo).filter((el) => { 
        if (el[1]) {
            return true;
        } else false;
    })
}

const updateDataByRegion = (region) => {
    getDataByRegion(region);
    removeStats(casesChart);
    for (let info of Object.values(currentContinentInfo)) {
        info[1][currentData] && addStats(casesChart, info[0], info[1][currentData])

    }
}


const updateData = (dataType) => {
    removeStats(casesChart);
    currentData = dataType;
    for (let info of Object.values(currentContinentInfo)) {
        info[1][dataType] && addStats(casesChart, info[0], info[1][dataType])
    }
}

const updateTitle =(country, data) => {
    switch (data) {
        case 0:
            data = 'Confirmed';
            break;
        case 1:
            data = 'Recovered';
            break;
        case 2:
            data = 'Critical';
            break;
        case 3:
            data = 'Deaths';
            break;
    }
    casesChart.data.datasets[0].label = `${country} Number of ${data} Cases`
    casesChart.update();
}

const getRegionCountries =(region)=> {
    let currentRegionCountries = []
    continentInfo[region].forEach(el => {
        el && currentRegionCountries.push(el)
    })

    document.querySelector('.regionCountries').innerHTML = '';
    for (let country of currentRegionCountries) {
        document.querySelector('.regionCountries').insertAdjacentHTML('beforeend', `<li>${country}</li>`);
    }
}

const showChart =()=> {
    document.querySelector('.chart').style.visibility = 'visible';
}

const updateDataChart =() => {
    showChart()
    updateData(currentData);
    updateTitle(currentRegion, currentData);
}

const updateRegionChart =()=> {
    switch (currentRegion) {
        case 'Oceania':
            [casesChart.data.datasets[0].backgroundColor, casesChart.data.datasets[0].borderColor] = ['green', 'black'];
            document.querySelector('.container').style.color = 'green';
            break;
        case 'Americas':
            [casesChart.data.datasets[0].backgroundColor, casesChart.data.datasets[0].borderColor] = ['black', 'black'];
            document.querySelector('.container').style.color = 'black';
            break;
        case 'Africa':
            [casesChart.data.datasets[0].backgroundColor, casesChart.data.datasets[0].borderColor] = ['red', 'black'];
            document.querySelector('.container').style.color = 'red';
            break;
        case 'Europe':
            [casesChart.data.datasets[0].backgroundColor, casesChart.data.datasets[0].borderColor] = ['blue', 'black'];
            document.querySelector('.container').style.color = 'blue';
            break;
        case 'Asia':
            [casesChart.data.datasets[0].backgroundColor, casesChart.data.datasets[0].borderColor] = ['rgb(228, 213, 8)', 'black'];
            document.querySelector('.container').style.color = 'rgb(228, 213, 8)';
            break;
    }
    showChart();
    updateDataByRegion(currentRegion);
    getRegionCountries(currentRegion)
    updateTitle(currentRegion, currentData);
}

const showCountriesList = () => {
  let countryList=   document.querySelector('.countriesList')
  countryList.style.display = 'block';
}

document.querySelector('.buttons ').addEventListener('click', (event) => {
    showCountriesList()
    switch (event.target.innerText) {
        case 'Asia':
            currentRegion = 'Asia';
            updateRegionChart()
            break;
        case 'Europe':
            currentRegion = 'Europe';
            updateRegionChart()
            break;
        case 'Africa':
            currentRegion = 'Africa';
            updateRegionChart()
            break;
        case 'Americas':
            currentRegion = 'Americas';
            updateRegionChart()
            break;
        case 'Oceania':
            currentRegion = 'Oceania';
            updateRegionChart()
            break;
        case 'Confirmed':
            currentData = 0;
            updateDataChart()
            break;
        case 'Deaths':
            currentData = 3;
            updateDataChart()
            break;
        case 'Recovered':
            currentData = 1;
            updateDataChart()
            break;
        case 'Critical':
            currentData = 2;
            updateDataChart()
            break;
    }
})

document.querySelector('.countriesList').addEventListener('click', (el) => {
    document.querySelector('.countryData-wrapper').style.display = 'block';
    let countryInfo = document.querySelector('.countryData')
    let [confirmed, deaths, recovered, critical, ] = countryInfo.querySelectorAll('p');
    confirmed.innerText = coronaInfo[el.target.innerText][0];
    recovered.innerText = coronaInfo[el.target.innerText][1];
    critical.innerText = coronaInfo[el.target.innerText][2];
    deaths.innerText = coronaInfo[el.target.innerText][3];
})


