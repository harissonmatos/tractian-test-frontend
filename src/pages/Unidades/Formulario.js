import {Breadcrumb, Button, Form, Input, message, Modal, Select} from 'antd';
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {QuestionCircleOutlined} from '@ant-design/icons';
import './Formulario.css';
import api from '../../services/api';

const {Option} = Select;
const {confirm} = Modal;

const initialValues = {
    nome: ''
}

const layout = {
    labelCol: {span: 3},
    wrapperCol: {span: 8},
};

const tailLayout = {
    wrapperCol: {offset: 3, span: 8},
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!'
};

export default function Formulario() {
    const history = useHistory();
    const {id_unidade} = useParams();
    const [form] = Form.useForm();

    const [empresas, setEmpresas] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const empresas = await api.get(`/empresas`);
            setEmpresas(empresas.data);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (typeof id_unidade !== 'undefined') {
            async function fetchData() {
                const unidade = await api.get(`/unidades/${id_unidade}`);
                form.setFieldsValue(unidade.data);
            }

            fetchData();
        }
    }, [form, id_unidade]);

    const onFinish = async form => {
        if (typeof id_unidade !== 'undefined') {
            form._id = id_unidade;
        }

        const msg_key = 'save';
        message.loading({content: 'Salvando unidade...', key: msg_key});

        try {
            const resultado = await api.post('/unidades/save', form);

            if (!!resultado.data.err) {
                message.error({
                    content: resultado.data.err,
                    key: msg_key,
                    duration: 10
                });

                return;
            }

            if (resultado.status !== 200 || resultado.data === null) {
                throw new Error('error');
            }
        } catch (err) {
            message.error({
                content: 'Erro ao salvar unidade!',
                key: msg_key,
                duration: 5
            });

            return;
        }

        message.success({
            content: 'Unidade salvo com sucesso!',
            key: msg_key,
            duration: 1,
            onClose: () => history.goBack()
        });
    }

    function showConfirmDelete() {
        confirm({
            title: 'Deletar esta unidade?',
            icon: <QuestionCircleOutlined/>,
            content: 'Após deletar esta unidade não será possivel reverter',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const resultado = await api.get(`/unidades/delete/${id_unidade}`);

                        if (resultado.status === 200 && resultado.data !== null && !resultado.data.err) {
                            resolve();

                            message.success({
                                content: 'Unidade excluido com sucesso!',
                                duration: 1,
                                onClose: () => history.goBack()
                            });

                            return;
                        }

                        reject();
                    } catch (err) {
                        reject();
                    }
                }).catch(() => {
                    message.error({
                        content: 'Erro ao excluir unidade!',
                        duration: 5
                    });
                });
            },
            onCancel() {
            },
        });
    }

    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Unidade</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                <Form form={form} {...layout} onFinish={onFinish} initialValues={initialValues}
                      validateMessages={validateMessages}>

                    <Form.Item name={['nome']} label={'Nome'} rules={[{required: true, min: 2, max: 50}]}>
                        <Input placeholder={'Ex. Motor 1'}/>
                    </Form.Item>

                    <Form.Item name={['empresa']} label={'Empresa'} rules={[{required: true}]}>
                        <Select>
                            {
                                empresas &&
                                empresas.map(unidade => <Option key={unidade._id}
                                                                value={unidade._id}>{unidade.nome}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Salvar</Button>
                        <Button type="secondary" onClick={() => history.goBack()}>Voltar</Button>
                        {
                            id_unidade &&
                            <Button type="danger" onClick={showConfirmDelete}>Excluir</Button>
                        }
                    </Form.Item>
                </Form>
                <br/>
            </div>
        </>
    );
}


