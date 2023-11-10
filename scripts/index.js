// import {Chart} from 'chart.js/auto';

const ctx = document.getElementById('income-diagram');
const ctr = document.getElementById('consumption-diagram');


new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Blue', 'Red', 'Yellow', 'Green', 'Purple'],
        datasets: [{
            label: 'My First Dataset',
            data: [30, 150, 140, 20, 90],
            backgroundColor: [
                'rgb(250,30,80)',
                'rgb(3,125,211)',
                'rgb(255, 205, 86)',
                'rgb(77,131,0)',
                'rgb(134,41,238)'
            ],
            hoverOffset: 4
        }]
    },
});

new Chart(ctr, {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100, 45, 125],
            backgroundColor: [
                'rgb(250,30,80)',
                'rgb(3,125,211)',
                'rgb(255, 205, 86)',
                'rgb(77,131,0)',
                'rgb(134,41,238)'
            ],
            hoverOffset: 4
        }],
    },
});

