// Vue Start↓↓------------------------------------
const { createApp, onBeforeMount } = Vue;
createApp({
    data() {
        return {
            agentPassStat_total: 0,//(上方標題)資產總數
            agentPassStat_passed: 0,//(上方標題)今日回報數
            agentPassStat_failed: 0,//(上方標題)今日未回報數
            agentPassStat_other: 0,//(上方標題)30天未回報數					
        }
    },
    methods: {
        fetchData() {
            axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/gcb.json')
                .then(response => {
                    this.agentPassStat_total = response.data.results.agentPassStat.total;
                    this.agentPassStat_passed = response.data.results.agentPassStat.passed;
                    this.agentPassStat_failed = response.data.results.agentPassStat.failed;
                    this.agentPassStat_other = response.data.results.agentPassStat.other;
                })
                .catch(error => {
                    console.log(error)
                });
            axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/vans.json')
                .then(res => {
                    //左邊線條圖表顯示start↓↓------------------------------------
                    const risk_history = res.data.results.calc.risk_history;
                    let detaStr = [];//日期
                    let allNum = [];//總風險數量
                    let highNum = [];//高風險數量
                    let mediumNum = [];//中風險數量
                    let lowNum = [];//低風險數量

                    //console.log(Object.keys(risk_history)[0]);
                    //console.log(risk_history[Object.keys(risk_history)[0]].high);

                    //因為risk_history是物件，因此無法用for處理，要使用Object.keys()！
                    Object.keys(risk_history).map((dateData) => {
                        let high = risk_history[dateData].high;
                        let medium = risk_history[dateData].medium;
                        let low = risk_history[dateData].low;
                        let all = high + medium + low;

                        detaStr.push(dateData);
                        allNum.push(all);
                        highNum.push(high);
                        mediumNum.push(medium);
                        lowNum.push(low);
                    });

                    let ctx = this.$refs.L_line;
                    //let ctx = document.getElementById('L_line');
                    let myChart = new Chart(ctx, {
                        type: 'line', //圖表類型
                        data: {//設定圖表資料
                            //標題						
                            labels: detaStr,//labels: ['日期1', '日期2', '日期3', '日期4', '日期5', '日期6'],
                            datasets: [{
                                label: '總高風險數',
                                data: allNum,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                fill: false,
                                borderColor: [
                                    'rgb(66, 139, 202)',
                                ],
                                tension: 0.4
                            }, {
                                label: '高風險',
                                data: highNum,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                fill: false,
                                borderColor: [
                                    'rgb(255, 193, 7)',
                                ],
                                tension: 0.4
                            }, {
                                label: '中風險',
                                data: mediumNum,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                fill: false,
                                borderColor: [
                                    'rgb(238, 133, 116)',
                                ],
                                tension: 0.4
                            }, {
                                label: '低風險',
                                data: lowNum,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                fill: false,
                                borderColor: [
                                    'rgb(92, 184, 92)',
                                ],
                                tension: 0.4
                            },
                            ]
                        },
                        options: {//圖表的一些其他設定，像是hover時外匡加粗
                            // 圖例
                            legend: {
                                display: true,
                            },
                        },

                    });
                    //左邊線條圖表顯示end↑↑------------------------------------


                    //右邊線條圖表資產顯示start↓↓------------------------------------
                    const rank = res.data.results.calc.rank;
                    let assetsName = [];//資產型號
                    let assetsNumber = [];//資產數量

                    //抓取json放到array內
                    for (let i = 0; i < rank.length; i++) {
                        assetsName.push(rank[i].soft_name);
                        let count = 0;
                        for (let j = 0; j < rank[i].assets.length; j++) {
                            count++;
                        }
                        assetsNumber.push(count);
                    }
                    //console.log("assetsName="+assetsName.length+"/assetsNumber="+assetsNumber.length);
                    //排序資產數量
                    let len = assetsNumber.length;
                    for (let i = 0; i < len; i++) {
                        for (let j = 0; j < len - i - 1; j++) {
                            if (assetsNumber[j] < assetsNumber[j + 1]) {
                                let temp = assetsNumber[j];
                                assetsNumber[j] = assetsNumber[j + 1];
                                assetsNumber[j + 1] = temp;

                                let temp2 = assetsName[j];
                                assetsName[j] = assetsName[j + 1];
                                assetsName[j + 1] = temp2;
                            }
                        }
                    }
                    let backgroundColor_assets = [];
                    for (let i = 0; i < 10; i++) {
                        backgroundColor_assets.push('rgb(66, 139, 202)');
                    }

                    let ctx2 = this.$refs.R_assets_bar;
                    //let ctx2 = document.getElementById('R_assets_bar');
                    let myChart2 = new Chart(ctx2, {
                        type: 'bar', //圖表類型
                        data: {//設定圖表資料
                            //標題						
                            labels: assetsName.slice(0, 10),//labels: ['日期1', '日期2', '日期3', '日期4', '日期5', '日期6'],
                            datasets: [{
                                label: '資產數',
                                data: assetsNumber.slice(0, 10),//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                //fill: false,
                                backgroundColor: backgroundColor_assets,
                                borderWidth: 0
                                //tension: 0.4
                            },
                            ]
                        },
                        options: {//圖表的一些其他設定，像是hover時外匡加粗
                            // 圖例

                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                        },
                    });
                    //右邊線條圖表資產顯示end↑↑------------------------------------

                    //右邊線條圖表CVE顯示start↓↓------------------------------------
                    //const rank = res.data.results.calc.rank;
                    let assetsName2 = [];//資產型號
                    //let assetsNumber = [];//資產數量
                    let CVE_highNumber = [];//高風險CVE
                    let CVE_mediumNumber = [];//中風險CVE
                    let CVE_lowNumber = [];//低風險CVE
                    let CVE_tatalNumber = [];//CVE總數

                    //抓取json放到array內
                    for (let i = 0; i < rank.length; i++) {
                        assetsName2.push(rank[i].soft_name);

                        CVE_highNumber.push(rank[i].cve_risk.high);
                        CVE_mediumNumber.push(rank[i].cve_risk.medium);
                        CVE_lowNumber.push(rank[i].cve_risk.low);
                        CVE_tatalNumber.push(rank[i].cve_risk.total);
                    }
                    //console.log("assetsName="+assetsName.length+"/assetsNumber="+assetsNumber.length);
                    //排序CVE數量
                    let len2 = CVE_tatalNumber.length;
                    for (let i = 0; i < len2; i++) {
                        for (let j = 0; j < len2 - i - 1; j++) {
                            if (CVE_tatalNumber[j] < CVE_tatalNumber[j + 1]) {
                                let temp = CVE_tatalNumber[j];
                                CVE_tatalNumber[j] = CVE_tatalNumber[j + 1];
                                CVE_tatalNumber[j + 1] = temp;

                                let temp2 = assetsName2[j];
                                assetsName2[j] = assetsName2[j + 1];
                                assetsName2[j + 1] = temp2;

                                let temp3 = CVE_highNumber[j];
                                CVE_highNumber[j] = CVE_highNumber[j + 1];
                                CVE_highNumber[j + 1] = temp3;

                                let temp4 = CVE_mediumNumber[j];
                                CVE_mediumNumber[j] = CVE_mediumNumber[j + 1];
                                CVE_mediumNumber[j + 1] = temp4;

                                let temp5 = CVE_lowNumber[j];
                                CVE_lowNumber[j] = CVE_lowNumber[j + 1];
                                CVE_lowNumber[j + 1] = temp5;
                            }
                        }
                    }
                    //console.log("assetsName="+assetsName);
                    //console.log("assetsNumber="+assetsNumber);

                    let backgroundColor_high = [];
                    let backgroundColor_medium = [];
                    let backgroundColor_low = [];
                    for (let i = 0; i < assetsName2.length; i++) {
                        backgroundColor_high.push('rgb(255, 99, 132)');
                        backgroundColor_medium.push('rgb(255, 205, 86)');
                        backgroundColor_low.push('rgb(75, 192, 192)');
                    }

                    let ctx3 = this.$refs.R_CVE_bar;
                    //let ctx3 = document.getElementById('R_CVE_bar');
                    let myChart3 = new Chart(ctx3, {
                        type: 'bar', //圖表類型
                        data: {//設定圖表資料
                            //標題						
                            labels: assetsName2,//labels: ['日期1', '日期2', '日期3', '日期4', '日期5', '日期6'],
                            datasets: [{
                                label: '高風險CVE數',
                                data: CVE_highNumber,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                //fill: false,
                                backgroundColor: backgroundColor_high,
                                borderWidth: 0
                                //tension: 0.4
                            }, {
                                label: '中風險CVE數',
                                data: CVE_mediumNumber,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                //fill: false,
                                backgroundColor: backgroundColor_medium,
                                borderWidth: 0
                                //tension: 0.4
                            }, {
                                label: '低風險CVE數',
                                data: CVE_lowNumber,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                //fill: false,
                                backgroundColor: backgroundColor_low,
                                borderWidth: 0
                                //tension: 0.4
                            },
                            ]
                        },
                        options: {//圖表的一些其他設定，像是hover時外匡加粗
                            // 圖例

                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                        },
                    });
                    //右邊線條圖表CVE顯示end↑↑------------------------------------
                })
                .catch(error => {
                    console.log(error)
                });


            //選擇CVE總數排名
            $("#selectAndShow").change(function () {
                var selectedOption = $("#selectAndShow").val();
                $(".optionCard").hide();
                $("#" + selectedOption).show();
            });

        }
    },
    mounted() {
        this.fetchData();
    }
}).mount('#app');

// Vue End↑↑------------------------------------


//選擇CVE總數排名
/*$(document).ready(function () {
    $("#selectAndShow").change(function () {
        var selectedOption = $("#selectAndShow").val();
        $(".optionCard").hide();
        $("#" + selectedOption).show();
    });
});*/


// //assets_今日回報數.json
// axios.get('https://cdn.jsdelivr.net/gh/IsFlyingDream/test_project/API_response/assets_%E4%BB%8A%E6%97%A5%E5%9B%9E%E5%A0%B1%E6%95%B8.json')
// 	.then(res => {
// 		console.log(res);
// 	})