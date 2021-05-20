import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {Layout} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import LayoutSider from "./containers/Sider";

const Home = lazy(() => import('./pages/Home/Home'));

const CadAtivo = lazy(() => import('./pages/Ativos/Formulario'));
const Ativos = lazy(() => import('./pages/Ativos/Listagem'));

const Empresas = lazy(() => import('./pages/Empresas/Listagem'));
const CadEmpresa = lazy(() => import('./pages/Empresas/Formulario'));

const Unidades = lazy(() => import('./pages/Unidades/Listagem'));
const CadUnidade = lazy(() => import('./pages/Unidades/Formulario'));

const Usuarios = lazy(() => import('./pages/Usuarios/Listagem'));
const CadUsuario = lazy(() => import('./pages/Usuarios/Formulario'));

const {Content, Footer} = Layout;

function App() {

    return (
        <Router>
            <Layout style={{minHeight: '100vh'}}>
                <LayoutSider/>
                <Layout className="site-layout">
                    <Content style={{margin: '0 16px'}}>
                        <Suspense fallback={<div>Carregando...</div>}>
                            <Switch>

                                <Route exact path={'/'} component={() => <Home/>}/>

                                <Route exact path={'/ativos'} component={() => <Ativos/>}/>
                                <Route exact path={'/ativos/cadastrar'} component={() => <CadAtivo/>}/>
                                <Route exact path={'/ativos/:id_ativo'} component={() => <CadAtivo/>}/>

                                <Route exact path={'/empresas'} component={() => <Empresas/>}/>
                                <Route exact path={'/empresas/cadastrar'} component={() => <CadEmpresa/>}/>
                                <Route exact path={'/empresas/:id_empresa'} component={() => <CadEmpresa/>}/>

                                <Route exact path={'/unidades'} component={() => <Unidades/>}/>
                                <Route exact path={'/unidades/cadastrar'} component={() => <CadUnidade/>}/>
                                <Route exact path={'/unidades/:id_unidade'} component={() => <CadUnidade/>}/>

                                <Route exact path={'/usuarios'} component={() => <Usuarios/>}/>
                                <Route exact path={'/usuarios/cadastrar'} component={() => <CadUsuario/>}/>
                                <Route exact path={'/usuarios/:id_usuario'} component={() => <CadUsuario/>}/>

                            </Switch>
                        </Suspense>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
