export class FormUtils {
    static get formItemLayoutProps() {
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

    static get submitFormItemLayoutProps() {
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
        };
    }

    static getFormItemOptions(fieldName, message = undefined, validator = undefined) {
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
}