var script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.js";
document.getElementsByTagName('head')[0].appendChild(script);


import axios from 'axios';

export default {
    data() {
        return {
            items: []
        };
    },
    mounted() {
        axios.get('https://github.com/IsFlyingDream/test_project/tree/main/API_response/assets_30天未回報數.json')
            .then(response => {
                this.items = response.data;
            })
            .catch(error => {
                console.error(error);
            });
        axios.get('https://github.com/IsFlyingDream/test_project/tree/main/API_response/assets_30天未回報數.json')
            .then(response => {
                this.items = response.data;
            })
            .catch(error => {
                console.error(error);
            });
        axios.get('https://github.com/IsFlyingDream/test_project/tree/main/API_response/assets_30天未回報數.json')
            .then(response => {
                this.items = response.data;
            })
            .catch(error => {
                console.error(error);
            });
        axios.get('https://github.com/IsFlyingDream/test_project/tree/main/API_response/assets_30天未回報數.json')
            .then(response => {
                this.items = response.data;
            })
            .catch(error => {
                console.error(error);
            });
        axios.get('https://github.com/IsFlyingDream/test_project/tree/main/API_response/assets_30天未回報數.json')
            .then(response => {
                this.items = response.data;
            })
            .catch(error => {
                console.error(error);
            });
    }
};



