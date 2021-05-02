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
    history.push('/login');
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
            {/* <Button size="large" type="primary" htmlType="submit" className="Login-form-button">
              Login
            </Button> */}
            <div className="mktwar-default-button-container" >
                <button className="mktwar-default-button">Login</button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <div className="Login-Footer" >
        <button onClick={goRegister}>
          Não tem uma conta ? <a>Criar Conta</a>
        </button>
      </div>
    </div>
  );
};

export default Login;
