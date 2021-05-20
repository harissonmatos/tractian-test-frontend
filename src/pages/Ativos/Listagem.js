import {useEffect, useState} from "react";
import {Breadcrumb, Button, Col, Form, Image, Input, message, Row, Select, Table, Tag} from 'antd';
import {Link} from "react-router-dom";
import api from "../../services/api";

import './Listagem.css';

const {Option} = Select;

const files_endpoint = 'http://localhost:3333/files';

export default function Listagem() {
    const [form] = Form.useForm();

    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unidades, setUnidades] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const unidades = await api.get(`/unidades`);
                setUnidades(unidades.data);

                const ativos = await api.get(`/ativos`);

                if (ativos.status !== 200 || ativos.data === null || !!ativos.err) {
                    throw new Error('error');
                }

                setDataSource(ativos.data);
            } catch (err) {
                message.error({
                    content: 'Erro ao carregar ativos!',
                    duration: 10
                });
            }

            setLoading(false);
        }

        fetchData();
    }, []);

    const onFinish = async form => {
        setLoading(true);

        try {
            const resultado = await api.post('/ativos', form);

            setDataSource(resultado.data);

            if (!!resultado.data.err) {
                message.error({
                    content: resultado.data.err,
                    duration: 10
                });

                return;
            }

            if (resultado.status !== 200 || resultado.data === null) {
                throw new Error('error');
            }
        } catch (err) {
            message.error({
                content: 'Erro ao atualizar lista!',
                duration: 5
            });
        }

        setLoading(false);
    }

    const onReset = () => {
        form.resetFields();
        form.submit();
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
            render: (text, row) => <Link to={`ativos/${row._id}`}>{text}</Link>,
        },
        {
            title: 'Unidade',
            dataIndex: 'unidade',
            key: 'unidade',
            render: unidade => `${unidade.nome}`
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
        },
        {
            title: 'Responsável',
            dataIndex: 'responsavel',
            key: 'responsavel',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color;

                switch (status) {
                    case 'Em Operação':
                        color = 'orange';
                        break;
                    case 'Em Alerta':
                        color = 'red';
                        break;
                    case 'Em Parada':
                    default:
                        color = 'default';
                }

                return (
                    <Tag color={color} key={status}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Nível de Saúde',
            dataIndex: 'nivel_saude',
            key: 'nivel_saude',
            render: saude => `${saude}%`
        }
    ];

    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Ativos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>

                <Row gutter={24}>
                    <Col>
                        <Link to={'/ativos/cadastrar'}>
                            <Button type="primary" htmlType="submit">Cadastrar Ativo</Button>
                        </Link>
                    </Col>
                </Row>
                <br/>
                <Form layout={'vertical'} onFinish={onFinish} form={form}>
                    <Row gutter={24}>
                        <Col sm={24} md={6}>
                            <Form.Item name={['nome']} label={'Nome'}>
                                <Input placeholder={'Ex. Motor 1'}/>
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={6}>
                            <Form.Item name={['unidade']} label={'Unidade'}>
                                <Select mode={'multiple'}>
                                    {
                                        unidades &&
                                        unidades.map(unidade => (
                                            <Option key={unidade._id} value={unidade._id}>{unidade.nome}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={6}>
                            <Form.Item name={['modelo']} label={'Modelo'}>
                                <Input placeholder={'Ex. WEG'}/>
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={6}>
                            <Form.Item name={['responsavel']} label={'Responsável'}>
                                <Input placeholder={'Ex. João'}/>
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={6}>
                            <Form.Item name={['status']} label={'Status'}>
                                <Select mode={'multiple'}>
                                    <Option value="Em Operação">Em Operação</Option>
                                    <Option value="Em Alerta">Em Alerta</Option>
                                    <Option value="Em Parada">Em Parada</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col>
                            <Button type="primary" htmlType="submit">Filtrar</Button>
                            <Button htmlType="button" onClick={onReset}>Limpar</Button>
                        </Col>
                    </Row>
                </Form>
                <br/>

                <Table
                    size={'middle'}
                    rowKey={record => record._id}
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    expandable={{
                        expandedRowRender: record => (
                            <>
                                {record.descricao &&
                                <p><b>Descrição:</b> {record.descricao}</p>
                                }
                                {record.imagem &&
                                <Image width={200} src={`${files_endpoint}/${record.imagem}`}/>
                                }
                            </>
                        ),
                        rowExpandable: record => (record.description || record.imagem)
                    }}
                />
            </div>
        </>
    );
}


