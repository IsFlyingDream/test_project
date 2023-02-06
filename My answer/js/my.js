var script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.js";
document.getElementsByTagName('head')[0].appendChild(script);




// axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_30%E5%A4%A9%E6%9C%AA%E5%9B%9E%E5%A0%B1%E6%95%B8.json')
// 	.then(res => {
// 		console.log(res);
// 	})
const fileNames = ['https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_%E4%BB%8A%E6%97%A5%E5%9B%9E%E5%A0%B1%E6%95%B8.json'];
fileNames.push('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_%E4%BB%8A%E6%97%A5%E5%9B%9E%E5%A0%B1%E6%95%B8.json');
fileNames.push('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_%E4%BB%8A%E6%97%A5%E6%9C%AA%E5%9B%9E%E5%A0%B1%E6%95%B8.json');
fileNames.push('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_%E4%BB%8A%E6%97%A5%E6%9C%AA%E5%9B%9E%E5%A0%B1%E6%95%B8.json');
fileNames.push('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/vans.json');

for (let i = 0; i < fileNames.length; i++) {
    axios.get(`${fileNames[i]}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}