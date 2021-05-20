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
    const {id_usuario} = useParams();
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
        if (typeof id_usuario !== 'undefined') {
            async function fetchData() {
                const usuario = await api.get(`/usuarios/${id_usuario}`);
                form.setFieldsValue(usuario.data);
            }

            fetchData();
        }
    }, [form, id_usuario]);

    const onFinish = async form => {
        if (typeof id_usuario !== 'undefined') {
            form._id = id_usuario;
        }

        const msg_key = 'save';
        message.loading({content: 'Salvando usuario...', key: msg_key});

        try {
            const resultado = await api.post('/usuarios/save', form);

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
                content: 'Erro ao salvar usuário!',
                key: msg_key,
                duration: 5
            });

            return;
        }

        message.success({
            content: 'Usuário salvo com sucesso!',
            key: msg_key,
            duration: 1,
            onClose: () => history.goBack()
        });
    }

    function showConfirmDelete() {
        confirm({
            title: 'Deletar esta usuario?',
            icon: <QuestionCircleOutlined/>,
            content: 'Após deletar esta usuário não será possivel reverter',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const resultado = await api.get(`/usuarios/delete/${id_usuario}`);

                        if (resultado.status === 200 && resultado.data !== null && !resultado.data.err) {
                            resolve();

                            message.success({
                                content: 'Usuário excluido com sucesso!',
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
                        content: 'Erro ao excluir usuario!',
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
                <Breadcrumb.Item>Usuário</Breadcrumb.Item>
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
                                empresas.map(usuario => <Option key={usuario._id}
                                                                value={usuario._id}>{usuario.nome}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Salvar</Button>
                        <Button type="secondary" onClick={() => history.goBack()}>Voltar</Button>
                        {
                            id_usuario &&
                            <Button type="danger" onClick={showConfirmDelete}>Excluir</Button>
                        }
                    </Form.Item>
                </Form>
                <br/>
            </div>
        </>
    );
}


