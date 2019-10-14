import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { UsersService } from '../../services/UsersService';
import { FormUtils } from '../shared';

class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = { passwordConfirmInvalid: false }
    }

    render() {
        const Item = Form.Item;
        const { getFieldDecorator } = this.props.form;
        return <div className="signup-form-layout">
            <Form {...FormUtils.formItemLayoutProps}>
                <Item label="Name">
                    {
                        getFieldDecorator('name', FormUtils.getFormItemOptions('name'))(<Input />)
                    }
                </Item>
                <Item label="E-mail">
                    {
                        getFieldDecorator('email', FormUtils.getFormItemOptions('e-mail'))(<Input />)
                    }
                </Item>
                <Item label="Password">
                    {
                        getFieldDecorator('password', FormUtils.getFormItemOptions('password', undefined, {
                            validator: this.validNextPassword()
                        }))(<Input.Password />)
                    }
                </Item>
                <Item label="Password confirm">
                    {
                        getFieldDecorator('password-confirm', FormUtils.getFormItemOptions('password-confirm', 'Please re-type password.', {
                            validator: this.compareFirstPassword()
                        }))(<Input.Password onBlur={e => this.setState({ passwordConfirmInvalid: !!e.target })} />)
                    }
                </Item>
                <Item {...FormUtils.submitFormItemLayoutProps}>
                    <Button type="primary" onClick={this.onRegister()}>Sign Up</Button>
                </Item>
            </Form>
        </div>
    }

    onRegister() {
        const { form } = this.props;
        return async e => {
            e.preventDefault();
            e.stopPropagation();
            form.validateFields(async (error, values) => {
                if (error) {
                    return;
                }

                values = _.omit(values, ['password-confirm']);
                
                try {
                    values = await UsersService.signup(values);
                    this.props.history.push('/');
                }
                catch (ex) {
                    Modal.error({
                        title: 'Sign up failed',
                        content: `User ${values.name} signs up failed. ${ex}.`
                    });
                }
            });
        }
    }

    compareFirstPassword() {
        const { form } = this.props;
        return (rule, value, callback) => {
            if (value && value !== form.getFieldValue('password')) {
                callback('The two passwords you entered is inconsistent!');
            }
            else {
                callback();
            }
        };
    }

    validNextPassword() {
        const { form } = this.props;
        return (rule, value, callback) => {
            if (value && this.state.passwordConfirmInvalid) {
                form.validateFields(['password-confirm'], { force: true });
            }

            callback();
        };
    }
}

export const SignUp = Form.create({ name: 'SignUp' })(SignUpForm);