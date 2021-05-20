import {Breadcrumb, Button, Form, Input, message, Modal} from 'antd';
import {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {QuestionCircleOutlined} from '@ant-design/icons';
import './Formulario.css';
import api from '../../services/api';

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
    const {id_empresa} = useParams();
    const [form] = Form.useForm();

    useEffect(() => {
        if (typeof id_empresa !== 'undefined') {
            async function fetchData() {
                const ativo = await api.get(`/empresas/${id_empresa}`);
                form.setFieldsValue(ativo.data);
            }

            fetchData();
        }
    }, [form, id_empresa]);

    const onFinish = async form => {
        if (typeof id_empresa !== 'undefined') {
            form._id = id_empresa;
        }

        const msg_key = 'save';
        message.loading({content: 'Salvando ativo...', key: msg_key});

        try {
            const resultado = await api.post('/empresas/save', form);

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
                content: 'Erro ao salvar empresa!',
                key: msg_key,
                duration: 5
            });

            return;
        }

        message.success({
            content: 'Empresa salvo com sucesso!',
            key: msg_key,
            duration: 1,
            onClose: () => history.goBack()
        });
    }

    function showConfirmDelete() {
        confirm({
            title: 'Deletar esta empresa?',
            icon: <QuestionCircleOutlined/>,
            content: 'Após deletar esta empresa não será possivel reverter',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const resultado = await api.get(`/empresas/delete/${id_empresa}`);

                        if (resultado.status === 200 && resultado.data !== null && !resultado.data.err) {
                            resolve();

                            message.success({
                                content: 'Empresa excluido com sucesso!',
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
                        content: 'Erro ao excluir empresa!',
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
                <Breadcrumb.Item>Empresa</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                <Form form={form} {...layout} onFinish={onFinish} initialValues={initialValues}
                            validateMessages={validateMessages}>

                    <Form.Item name={['nome']} label={'Nome'} rules={[{required: true, min: 2, max: 50}]}>
                        <Input placeholder={'Ex. Motor 1'}/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Salvar</Button>
                        <Button type="secondary" onClick={() => history.goBack()}>Voltar</Button>
                        {
                            id_empresa &&
                            <Button type="danger" onClick={showConfirmDelete}>Excluir</Button>
                        }
                    </Form.Item>
                </Form>
                <br/>
            </div>
        </>
    );
}


