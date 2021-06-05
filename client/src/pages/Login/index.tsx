import React from "react";
import "./style.css";

import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useUserContext } from "../../context/user/user.context";

import history from '../../utils/history';


const Login = () => {

  const { login } = useUserContext();

  const onFinish = (values: any) => {
    login(values);
  };

  const goRegister= () => {
    history.push('/register');
  }

  return (
    <div className="Login-Container">

      <div className="Login-Header">
        <h1>MktWar</h1>
      </div>

      <div className="Login-Form">
        <Form
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Insira seu usuário por favor !" }]}
          >
            <Input placeholder="Usuário" prefix={<UserOutlined />} size="large"/>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Insira sua senha por favor !" }]}
          >
            <Input.Password size="large" placeholder="Senha" prefix={<LockOutlined />}/>
          </Form.Item>

          <Form.Item >
            <div className="mktwar-default-button-container login-button" >
                <button className="mktwar-default-button login-button">Login</button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <div className="Login-Footer" >
        <button className="login-register-option" onClick={goRegister}>
          Não tem uma conta ? Criar Conta
        </button>
      </div>
    </div>
  );
};

export default Login;
