export const photoService = {
    getImages() {
        return fetch('/data/photos.json')
            .then(res => res.json())
            .then(d => d); // hoặc d nếu file là mảng
    }
};