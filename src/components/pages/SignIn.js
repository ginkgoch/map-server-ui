import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { FormUtils } from '../shared';

class SignInForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { Item } = Form;
        return <div className="signup-form-layout">
            <Form {...FormUtils.formItemLayoutProps}>
                <Item label="Name">
                    {
                        getFieldDecorator('name', FormUtils.getFormItemOptions('name'))(<Input />)
                    }
                </Item>
                <Item label="Password">
                    {
                        getFieldDecorator('password', FormUtils.getFormItemOptions('password'))(<Input.Password />)
                    }
                </Item>
                <Item {...FormUtils.submitFormItemLayoutProps}>
                    <Button type="primary" onClick={this.onSignIn()}>Sign In</Button>
                </Item>
            </Form>
        </div>;
    }

    onSignIn() {
        return async e => {
            e.preventDefault();

            this.props.form.validateFields(async (error, values) => {
                if (!error) {
                    return;
                }

                //TODO:
            });
        };
    }
}

export const SignIn = Form.create({ name: 'SignIn' })(SignInForm);