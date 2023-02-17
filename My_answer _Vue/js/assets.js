
// Vue Start↓↓------------------------------------
const { createApp, onBeforeMount } = Vue;
createApp({
    data() {
        return {
            agentPassStat_total: 0,//(上方標題)資產總數
            agentPassStat_passed: 0,//(上方標題)今日回報數
            agentPassStat_failed: 0,//(上方標題)今日未回報數
            agentPassStat_other: 0,//(上方標題)30天未回報數		

            agentSoftInfo_systems: [],//作業系統內容
            agentSoftInfo_IEs: [],//IE內容
            agentSoftInfo_Googles: [],//GOOGLE內容
        }
    },
    methods: {
        fetchData() {
            //gcb.json-↓↓--start----------------------------------
            axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/gcb.json')
                .then(response => {
                    this.agentPassStat_total = response.data.results.agentPassStat.total;
                    this.agentPassStat_passed = response.data.results.agentPassStat.passed;
                    this.agentPassStat_failed = response.data.results.agentPassStat.failed;
                    this.agentPassStat_other = response.data.results.agentPassStat.other;

                    const agentSoftInfo = response.data.results.agentSoftInfo;
                    //左下角作業系統訊息start-↓↓--------------------------------							

                    for (let i = 0; i < agentSoftInfo.length; i++) {
                        //1.作業系統↓↓------------------------------------------------
                        if (agentSoftInfo[i].name == "Operation System") {
                            let otherNum = 0;//(圖表)other數量
                            let WindowsNum = 0;//(圖表)Windows數量
                            let LinuxNum = 0;//(圖表)Linux數量
                            let FirefoxNum = 0;//(圖表)Firefox數量
                            for (let j = 0; j < agentSoftInfo[i].list.length; j++) {//顯示文字

                                let list = agentSoftInfo[i].list[j];

                                this.agentSoftInfo_systems.push(list);//顯示作業系統規格

                                //圖表資料計算↓
                                if (list.version.includes("Windows") == true) {
                                    WindowsNum++;
                                } else if (list.version.includes("Linux") == true) {
                                    LinuxNum++;
                                } else if (list.version.includes("Firefox") == true) {
                                    FirefoxNum++;
                                } else {
                                    otherNum++;
                                }
                            }

                            //顯示圓餅圖圖形資料↓↓---------------------------------
                            /*色票
                                'rgba(214, 243, 231, 1)',
                                'rgba(173, 251, 218, 1)',
                                'rgba(173, 236, 204, 1)',
                                'rgba(160, 220, 196, 1)',
                                'rgba(118, 208, 164, 1)'
                            */
                            let ctx = this.$refs.L_pie_system;
                            //let ctx = document.getElementById('L_pie_system');
                            let myChart = new Chart(ctx, {
                                type: 'doughnut', //圖表類型
                                data: {//設定圖表資料
                                    //標題
                                    labels: ['others', 'Windows', 'Linux', 'Firefox'],
                                    datasets: [{
                                        label: '# test', //標籤
                                        data: [otherNum, WindowsNum, LinuxNum, FirefoxNum], //資料
                                        //圖表背景色
                                        backgroundColor: [
                                            'rgba(214, 243, 231, 1)',
                                            'rgba(173, 251, 218, 1)',
                                            'rgba(160, 220, 196, 1)',
                                            'rgba(118, 208, 164, 1)'
                                        ],
                                        hoverOffset: 4,
                                    }]
                                },
                                options: {//圖表的一些其他設定，像是hover時外匡加粗
                                    // 圖例
                                    legend: {
                                        display: false,
                                    },
                                }
                            });
                            //顯示圓餅圖圖形資料↑↑---------------------------------

                        } //1.作業系統↑↑------------------------------------------------

                        else if (agentSoftInfo[i].name == "Internet Explorer") {//2.IE↓↓------------------------------------------------
                            let name = [];
                            let howMuch = [];
                            for (let j = 0; j < agentSoftInfo[i].list.length; j++) {//顯示文字

                                let list = agentSoftInfo[i].list[j];
                                howMuch.push(agentSoftInfo[i].list[j].count);
                                if (j == 0) {
                                    // $('#agentSoftInfo_IE').html(list.version + " - " + list.count + " 台 <br>");
                                    name.push(list.version);
                                    this.agentSoftInfo_IEs.push(list);
                                } else {
                                    // $('#agentSoftInfo_IE').append(agentSoftInfo[i].name + list.version + " - " + list.count + " 台 <br>");
                                    name.push(agentSoftInfo[i].name + list.version);
                                    this.agentSoftInfo_IEs.push({ version: agentSoftInfo[i].name + list.version, count: list.count });
                                }
                            }

                            //console.log("IEname=" + name);
                            //console.log("IEname.length=" + name.length + "/IEhowMuch.length=" + howMuch.length);
                            //顯示圓餅圖圖形資料↓↓---------------------------------						
                            let ctx = this.$refs.L_pie_IE;
                            //let ctx = document.getElementById('L_pie_IE');
                            let myChart = new Chart(ctx, {
                                type: 'doughnut', //圖表類型
                                data: {//設定圖表資料
                                    //標題
                                    labels: name,
                                    datasets: [{
                                        label: '# test', //標籤
                                        data: howMuch, //資料
                                        //圖表背景色
                                        backgroundColor: [
                                            'rgba(214, 243, 231, 1)',
                                            'rgba(173, 251, 218, 1)',
                                            'rgba(173, 236, 204, 1)',
                                            'rgba(160, 220, 196, 1)',
                                            'rgba(118, 208, 164, 1)',
                                        ],
                                        hoverOffset: 4,
                                    }]
                                },
                                options: {//圖表的一些其他設定，像是hover時外匡加粗
                                    // 圖例
                                    legend: {
                                        display: false,
                                    },
                                }
                            });
                            //顯示圓餅圖圖形資料↑↑---------------------------------						
                        }//2.IE↑↑------------------------------------------------

                        //3.Google↓↓------------------------------------------------
                        else if (agentSoftInfo[i].name == "Google Chrome") {
                            let name = [];
                            let howMuch = [];
                            for (let j = 0; j < agentSoftInfo[i].list.length; j++) {//顯示文字

                                let list = agentSoftInfo[i].list[j];
                                howMuch.push(agentSoftInfo[i].list[j].count);
                                if (j == 0) {
                                    this.agentSoftInfo_Googles.push(list);
                                    //$('#agentSoftInfo_Google').html(list.version + " - " + list.count + " 台 <br>");
                                    name.push(list.version);
                                } else {
                                    this.agentSoftInfo_Googles.push({ version: agentSoftInfo[i].name + list.version, list: list.count });
                                    //$('#agentSoftInfo_Google').append(agentSoftInfo[i].name + list.version + " - " + list.count + " 台 <br>");
                                    name.push(agentSoftInfo[i].name + list.version);
                                }
                            }

                            //顯示圓餅圖圖形資料↓↓---------------------------------	
                            let backgroundColor_google = [];
                            for (let i = 0; i < 5; i++) {
                                backgroundColor_google.push('rgba(214, 243, 231, 1)');
                                backgroundColor_google.push('rgba(173, 251, 218, 1)');
                                backgroundColor_google.push('rgba(160, 220, 196, 1)');
                                backgroundColor_google.push('rgba(118, 208, 164, 1)');
                            }

                            let ctx = this.$refs.L_pie_Google;
                            //let ctx = document.getElementById('L_pie_Google');
                            let myChart = new Chart(ctx, {
                                type: 'doughnut', //圖表類型
                                data: {//設定圖表資料
                                    //標題
                                    labels: name,
                                    datasets: [{
                                        label: '# test', //標籤
                                        data: howMuch, //資料
                                        //圖表背景色
                                        backgroundColor: backgroundColor_google,
                                        hoverOffset: 4,
                                    }]
                                },
                                options: {//圖表的一些其他設定，像是hover時外匡加粗
                                    // 圖例
                                    legend: {
                                        display: false,
                                    },
                                }
                            });
                            //顯示圓餅圖圖形資料↑↑---------------------------------						
                        }//3.Google↑↑------------------------------------------------

                    }


                    //2.Internet Explorer↓↓------------------------------------------------

                    //<<<<待處理...>>>>>

                    //2.Internet Explorer↑↑------------------------------------------------
                    /*
                        L_pie_system
                        L_pie_Google
                        L_pie_Firefox
                        L_pie_Edge
                        L_pie_Java
                        L_pie_AS
                        L_pie_Flash
                        L_pie_Adobe
                    */

                    //左下角作業系統訊息end-↑↑--------------------------------


                })
                .catch(error => {
                    console.log(error)
                });
            //gcb.json-↑↑--end------------------------------------

            //assets_30天未回報數.json-↓↓------------------------------------

            axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_30%E5%A4%A9%E6%9C%AA%E5%9B%9E%E5%A0%B1%E6%95%B8.json')
                .then(res => {
                    const ManeydayUReturn = res.data.results.totalRow;
                    $('#ManeydayUReturn').html(ManeydayUReturn);


                    //右邊線條圖表顯示start↓↓------------------------------------
                    const agents = res.data.results.agents;

                    let agentsCount = 0;
                    let detaStr = [];//未回報日期
                    let deteNum = [];//未回報數量
                    for (let i = 0; i < agents.length; i++) {
                        let agentsString = agents[i].createdAt.slice(0, 10);
                        if (i == 0) {
                            detaStr.push(agentsString);
                            agentsCount = 1;
                        } else if (agentsString == detaStr[detaStr.length - 1]) {
                            agentsCount++;
                        } else {
                            detaStr.push(agentsString);
                            deteNum.push(agentsCount);
                            agentsCount = 1;
                        }
                    }

                    var ctx = this.$refs.R_line;
                    //var ctx = document.getElementById('R_line');
                    var myChart = new Chart(ctx, {
                        type: 'line', //圖表類型
                        data: {//設定圖表資料
                            //標題						
                            labels: detaStr,//labels: ['日期1', '日期2', '日期3', '日期4', '日期5', '日期6'],
                            datasets: [{
                                label: 'My First Dataset',
                                data: deteNum,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                fill: false,
                                borderColor: [
                                    'rgb(238, 133, 116)',
                                ],
                                tension: 0.1
                            },

                            ]
                        },
                        options: {//圖表的一些其他設定，像是hover時外匡加粗
                            // 圖例
                            legend: {
                                display: false,
                            },

                        },

                    });

                    //右邊線條圖表顯示end↑↑------------------------------------
                });

            //assets_30天未回報數.json-↑↑------------------------------------


            //  點擊按鈕切頁↓↓-------------------------------------					
            let system_btn = ["#systemtag_btn", "#IE_btn", "#Google_btn", "#Firefox_btn", "#Edge_btn", "#Java_btn", "#AS_btn", "#Flash_btn", "#Adobe_btn"];
            let system_list = ["#systemtag", "#IE", "#Google", "#Firefox", "#Edge", "#Java", "#AS", "#Flash", "#Adobe"];

            for (let i = 0; i < system_btn.length; i++) {
                $(system_btn[i]).click(function () {
                    for (let j = 0; j < system_list.length; j++) {
                        if (j == i) {
                            $(system_list[j]).show();
                        } else {
                            $(system_list[j]).hide();
                        }
                    }
                });
            }
            //  點擊按鈕切頁↑↑-------------------------------------
        }
    },
    mounted() {
        this.fetchData();
    }
}).mount('#app');

		// Vue End↑↑------------------------------------


		//  點擊按鈕切頁↓↓-------------------------------------
/*
$(document).ready(function () {
    let system_btn = ["#systemtag_btn", "#IE_btn", "#Google_btn", "#Firefox_btn", "#Edge_btn", "#Java_btn", "#AS_btn", "#Flash_btn", "#Adobe_btn"];
    let system_list = ["#systemtag", "#IE", "#Google", "#Firefox", "#Edge", "#Java", "#AS", "#Flash", "#Adobe"];

    for (let i = 0; i < system_btn.length; i++) {
        $(system_btn[i]).click(function () {
            for (let j = 0; j < system_list.length; j++) {
                if (j == i) {
                    $(system_list[j]).show();
                } else {
                    $(system_list[j]).hide();
                }
            }
        });
    }
});*/
		//  點擊按鈕切頁↑↑-------------------------------------
