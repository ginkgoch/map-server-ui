export const randomColor = () => {
    return '#' + parseInt(Math.random() * 0xffffff).toString(16);
};