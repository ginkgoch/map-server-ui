import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

class SignupForm extends Component {
    constructor(props) {
        super(props);

        this.state = { passwordConfirmInvalid: false }
    }

    render() {
        const Item = Form.Item;
        const { getFieldDecorator } = this.props.form;
        return <div className="signup-form-layout">
            <Form {...this.getFormItemProps()}>
                <Item label="Name">
                    {
                        getFieldDecorator('name', this.getRules('name'))(<Input />)
                    }
                </Item>
                <Item label="E-mail">
                    {
                        getFieldDecorator('email', this.getRules('e-mail'))(<Input />)
                    }
                </Item>
                <Item label="Password">
                    {
                        getFieldDecorator('password', this.getRules('password', undefined, {
                            validator: this.validNextPassword()
                        }))(<Input.Password />)
                    }
                </Item>
                <Item label="Password confirm">
                    {
                        getFieldDecorator('password-confirm', this.getRules('password-confirm', 'Please re-type password.', {
                            validator: this.compareFirstPassword()
                        }))(<Input.Password onBlur={e => this.setState({ passwordConfirmInvalid: !!e.target })} />)
                    }
                </Item>
                <Item {...this.getSubmitFormItemProps()}>
                    <Button type="primary" onClick={this.onRegister()}>Submit</Button>
                </Item>
            </Form>
        </div>
    }

    onRegister() {
        const { form } = this.props;
        return e => {
            e.preventDefault();
            e.stopPropagation();
            form.validateFields((error, values) => {
                console.log(error, values);
            });
        }
    }

    getFormItemProps() {
        return {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
    }

    getSubmitFormItemProps() {
        return {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            }
        }
    }

    getRules(fieldName, message = undefined, validator = undefined) {
        const rules = [
            {
                required: true,
                message: message || `Please input ${fieldName}.`
            }
        ];

        if (validator) {
            rules.push(validator);
        }

        return { rules };
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

export const Signup = Form.create({ name: 'Signup' })(SignupForm);