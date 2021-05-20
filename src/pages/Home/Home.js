import {Breadcrumb, Col, Row} from 'antd';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const optionsGraph1 = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Status dos Ativos Agora'
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
            {name: 'Em Operação', y: 50, color: 'blue'},
            {name: 'Em Alerta', y: 20, color: 'red'},
        ]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 300
            },
            chartOptions: {
                legend: {
                    enabled: false
                }
            }
        }]
    }
};

const optionsGraph2 = {
    title: {
        text: 'Status dos Ativos Semanal'
    },

    yAxis: {
        title: {
            text: 'Número de Ativos'
        },
        type: 'logarithmic',
        minorTickInterval: 0.1,
    },

    xAxis: {
        categories: ['15/05', '16/05', '17/05', '18/05', '19/05', '20/05',
            '21/05', '22/05']
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            }
        }
    },

    series: [{
        name: 'Em Parada',
        data: [6, 1, 4, 1, 3, 3, 1],
        color: 'grey'
    }, {
        name: 'Em Operação',
        data: [200, 250, 158, 246, 214, 210, 186],
        color: 'blue'
    }, {
        name: 'Em Alerta',
        data: [1, 1, 1, 2, 1, 1, 2],
        color: 'red'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    enabled: false
                }
            }
        }]
    }

};

export default function Home() {
    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Ativos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 12}}>
                <Row>
                    <Col xs={{span: 24}} md={{span: 12}}>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={optionsGraph1}
                            />
                        </div>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 12}}>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={optionsGraph2}
                            />
                        </div>
                    </Col>

                </Row>
            </div>
        </>
    );
}


