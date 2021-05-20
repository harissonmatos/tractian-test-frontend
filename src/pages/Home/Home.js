import {Breadcrumb} from 'antd';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Ativos'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Ativos',
        innerSize: '50%',
        data: [
            {name: 'Em Parada', y: 30, color: 'grey'},
            {name: 'Em Operação', y: 50, color: 'green'},
            {name: 'Em Alerta', y: 20, color: 'orange'},
        ]
    }]
};

export default function Home() {
    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Ativos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>

                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />

                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />

            </div>
        </>
    );
}


