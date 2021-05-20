import {useEffect, useState} from "react";
import {Breadcrumb, Button, Col, Form, Input, message, Row, Table} from 'antd';
import {Link} from "react-router-dom";
import api from "../../services/api";

export default function Listagem() {
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const ativos = await api.get(`/empresas`);

                if (ativos.status !== 200 || ativos.data === null || !!ativos.err) {
                    throw new Error('error');
                }

                setDataSource(ativos.data);
            } catch (err) {
                message.error({
                    content: 'Erro ao carregar empresas!',
                    duration: 10
                });
            }

            setLoading(false);
        }

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
            render: (text, row) => <Link to={`/empresas/${row._id}`}>{text}</Link>,
        }
    ];

    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Empresas</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>

                <Row gutter={24}>
                    <Col>
                        <Link to={'/empresas/cadastrar'}>
                            <Button type="primary" htmlType="submit">Cadastrar Empresa</Button>
                        </Link>
                    </Col>
                </Row>
                <br/>
                <Form layout={'vertical'}>
                    <Row gutter={24}>
                        <Col sm={24} md={6}>
                            <Form.Item name={['nome']} label={'Nome'}>
                                <Input placeholder={'Ex. Motor 1'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col>
                            <Button type="primary" htmlType="submit">Filtrar</Button>
                        </Col>
                    </Row>
                </Form>
                <br/>
                <Table
                    size={'middle'}
                    rowKey={record => record._id}
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}/>
            </div>
        </>
    );
}


