import { Modal } from "antd";

const { confirm } = Modal;
export class ModalUtils {
    static promptRemoveModal(typeName, removeHandler) {
        this.promptModal(`Are you sure to remove this ${typeName}?`, removeHandler);
    }

    static promptModal(content, handler, title = 'Please Confirm') {
        confirm({ title, content, onOk: () => {
            handler && handler();
        } });
    }
}