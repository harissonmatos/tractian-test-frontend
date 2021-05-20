import {Breadcrumb, Button, Form, Image, Input, InputNumber, message, Modal, Select, Upload} from 'antd';
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {QuestionCircleOutlined, UploadOutlined} from '@ant-design/icons';
import './Formulario.css';
import api from '../../services/api';

const {Option} = Select;
const {confirm} = Modal;

const files_endpoint = 'http://localhost:3333/files';

const initialValues = {
    nome: '',
    descricao: '',
    unidade: '',
    modelo: '',
    responsavel: '',
    status: 'Em Parada',
    nivel_saude: 100
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
    required: '${label} is required!',
    types: {
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const dummyRequest = ({onSuccess}) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export default function Formulario() {
    const history = useHistory();
    const {id_ativo} = useParams();
    const [form] = Form.useForm();

    const [unidades, setUnidades] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const unidades = await api.get(`/unidades`);
            setUnidades(unidades.data);
        }

        fetchData();

    }, []);

    useEffect(() => {
        if (typeof id_ativo !== 'undefined') {
            async function fetchData() {
                const unidades = await api.get(`/unidades`);
                setUnidades(unidades.data);

                const ativo = await api.get(`/ativos/${id_ativo}`);
                form.setFieldsValue(ativo.data);

                if (!!ativo.data.imagem) {
                    setImageUrl(`${files_endpoint}/${ativo.data.imagem}`);
                }
            }

            fetchData();
        }
    }, [form, id_ativo]);

    const onFinish = async form => {
        const data = new FormData();

        if (typeof id_ativo !== 'undefined') {
            data.append('_id', id_ativo);
        }

        form.imagem = imageFile;

        Object.keys(form).map(field => data.append(field, form[field]));

        const msg_key = 'save';
        message.loading({content: 'Salvando ativo...', key: msg_key});

        try {
            const resultado = await api.post('/ativos/save', data);

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
                content: 'Erro ao salvar ativo!',
                key: msg_key,
                duration: 5
            });

            return;
        }

        message.success({
            content: 'Ativo salvo com sucesso!',
            key: msg_key,
            duration: 1,
            onClose: () => history.goBack()
        });
    }

    function showConfirmDelete() {
        confirm({
            title: 'Deletar este ativo?',
            icon: <QuestionCircleOutlined/>,
            content: 'Após deletar este ativo não será possivel reverter',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const resultado = await api.get(`/ativos/delete/${id_ativo}`);

                        if (resultado.status === 200 && resultado.data !== null && !resultado.data.err) {
                            resolve();

                            message.success({
                                content: 'Ativo excluido com sucesso!',
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
                        content: 'Erro ao excluir ativo!',
                        duration: 5
                    });
                });
            },
            onCancel() {
            },
        });
    }

    const handleChangeUpload = info => {
        setImageFile(info.file.originFileObj);

        const newImageUrl = URL.createObjectURL(info.file.originFileObj);
        setImageUrl(newImageUrl);

        return false;
    };

    return (
        <>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Ativo</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                <Form form={form} {...layout} onFinish={onFinish} initialValues={initialValues}
                      validateMessages={validateMessages}>
                    <Form.Item name={['imagem']} label={'Imagem'}>
                        <>
                            <Upload
                                onChange={handleChangeUpload}
                                beforeUpload={beforeUpload}
                                customRequest={dummyRequest}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined/>}>Selecionar Imagem</Button>
                            </Upload>
                            {imageUrl !== null &&
                            <>
                                <br/><br/>
                                <Image width={200} src={imageUrl}/>
                            </>
                            }
                        </>
                    </Form.Item>

                    <Form.Item name={['nome']} label={'Nome'} rules={[{required: true, min: 2, max: 50}]}>
                        <Input placeholder={'Ex. Motor 1'}/>
                    </Form.Item>

                    <Form.Item name={['descricao']} label={'Descricao'} rules={[{min: 2, max: 50}]}>
                        <Input placeholder={'Ex. Motor do elevador 1'}/>
                    </Form.Item>

                    <Form.Item name={['unidade']} label={'Unidade'} rules={[{required: true}]}>
                        <Select>
                            {
                                unidades &&
                                unidades.map(unidade => <Option key={unidade._id}
                                                                value={unidade._id}>{unidade.nome}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name={['modelo']} label={'Modelo'} rules={[{min: 2, max: 50}]}>
                        <Input placeholder={'Ex. WEG'}/>
                    </Form.Item>

                    <Form.Item name={['responsavel']} label={'Responsável'} rules={[{min: 2, max: 50}]}>
                        <Input placeholder={'Ex. João'}/>
                    </Form.Item>

                    <Form.Item name={['status']} label={'Status'} rules={[{required: true}]}>
                        <Select>
                            <Option value="Em Parada">Em Parada</Option>
                            <Option value="Em Operação">Em Operação</Option>
                            <Option value="Em Alerta">Em Alerta</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name={['nivel_saude']} label={'Nível de saúde'}
                               rules={[{required: true, type: 'number', min: 0, max: 100}]}>
                        <InputNumber/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">Salvar</Button>
                        <Button type="secondary" onClick={() => history.goBack()}>Voltar</Button>
                        {
                            id_ativo &&
                            <Button type="danger" onClick={showConfirmDelete}>Excluir</Button>
                        }
                    </Form.Item>
                </Form>
                <br/>
            </div>
        </>
    );
}


