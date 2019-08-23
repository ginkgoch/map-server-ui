import { Modal } from "antd";

const { confirm } = Modal;
export class ModalUtils {
    static promptRemoveModal(typeName, removeHandler) {
        confirm({ title: 'Please Confirm', content: `Are you sure to remove this ${typeName}?`, onOk: () => {
            removeHandler && removeHandler();
        } });
    }
}