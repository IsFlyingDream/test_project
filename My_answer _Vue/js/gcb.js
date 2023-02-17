
// Vue Start↓↓------------------------------------
const { createApp, onBeforeMount } = Vue;
createApp({
    data() {
        return {
            agentPassStat_total: 0,//(上方標題)資產總數
            agentPassStat_passed: 0,//(上方標題)今日回報數
            agentPassStat_failed: 0,//(上方標題)今日未回報數
            agentPassStat_other: 0,//(上方標題)30天未回報數			

            R_assets_dates: [],//近期稽核情形 (稽核資產數)文字內容
            RL_assets_date: [0, 0, 0],//資產符合率_文字內容
            trust_sites: [],//信任網站
            agentAuditInfo_datas: [],//稽核項目分類統計資料
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

                    //左上近期稽核顯示start↓↓------------------------------------
                    const agentScanInfo = response.data.results.agentScanInfo;//近期稽核情形

                    let agentScanInfo_dataAry = [];//日期
                    let agentScanInfo_numAry = [];//數量

                    //抓取json放到array內
                    Object.keys(agentScanInfo).map((dateData) => {
                        agentScanInfo_dataAry.push(dateData);
                        agentScanInfo_numAry.push(agentScanInfo[dateData]);
                        this.R_assets_dates.push({ date: dateData, num: agentScanInfo[dateData] });
                        //$('#R_assets_date').append(`<div><h5>${agentScanInfo[dateData]}</h5><p><small>最近${dateData}日</small></p></div>`)
                    });

                    //console.log("R_assets_dates=" + this.R_assets_dates);
                    //console.log("agentScanInfo_numAry=" + agentScanInfo_numAry);

                    let ctx = this.$refs.R_assets_bar;
                    //let ctx = document.getElementById('R_assets_bar');
                    let myChart = new Chart(ctx, {
                        type: 'bar', //圖表類型
                        data: {//設定圖表資料
                            //標題						
                            labels: agentScanInfo_dataAry,//labels: ['日期1', '日期2', '日期3', '日期4', '日期5', '日期6'],
                            datasets: [{
                                label: '稽核資產數',
                                data: agentScanInfo_numAry,//data: [2540, 2540, 2540, 2540, 2540, 2540, 2540],
                                //fill: false,
                                backgroundColor: [
                                    'rgb(66, 139, 202)',
                                    'rgb(66, 139, 202)',
                                    'rgb(66, 139, 202)',
                                    'rgb(66, 139, 202)',
                                    'rgb(66, 139, 202)',
                                ],
                                borderWidth: 1,
                                //tension: 0.4
                            },
                            ]
                        },
                        options: {//圖表的一些其他設定，像是hover時外匡加粗
                            // 圖例
                            scales: {
                                y: {
                                    beginAtZero: true,
                                }
                            },
                        },
                    });
                    //左上近期稽核顯示end↑↑------------------------------------

                    //左上右資產合規率start↓↓------------------------------------
                    const ratio = response.data.results.agentPassStat.ratio;//資產合規率

                    let agentPassStat_NUM = [];//比例


                    agentPassStat_NUM.push(ratio.passed);
                    agentPassStat_NUM.push(ratio.failed);
                    agentPassStat_NUM.push(ratio.other);

                    let passed = (ratio.passed * 100).toFixed(2) + "%";
                    let failed = (ratio.failed * 100).toFixed(2) + "%";
                    let other = (ratio.other * 100).toFixed(2) + "%";

                    this.RL_assets_date = [passed, failed, other];

                    //顯示圓餅圖圖形資料↓↓---------------------------------
                    //色票
                    // 'rgba(214, 243, 231, 1)',
                    // 'rgba(173, 251, 218, 1)',
                    // 'rgba(173, 236, 204, 1)',
                    // 'rgba(160, 220, 196, 1)',
                    // 'rgba(118, 208, 164, 1)'
                    let ctx2 = this.$refs.RL_assets_doughnut;
                    //let ctx2 = document.getElementById('RL_assets_doughnut');
                    let myChart2 = new Chart(ctx2, {
                        type: 'doughnut', //圖表類型
                        data: {//設定圖表資料
                            //標題
                            labels: ['符合', '未符合', '未稽核'],
                            datasets: [{
                                label: '資產符合率', //標籤
                                data: agentPassStat_NUM, //資料
                                //圖表背景色
                                backgroundColor: [
                                    'rgba(32, 168, 216, 1)',
                                    'rgba(248, 108, 107, 1)',
                                    'rgba(77, 189, 116, 1)',
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
                    //左上右資產合規率end↑↑------------------------------------

                    //左下『信任網站列表』顯示start↓↓------------------------------------
                    const agentTrustSiteInfo = response.data.results.agentTrustSiteInfo;//信任網站

                    //抓取json放到顯示內				
                    for (let i = 0; i < agentTrustSiteInfo.length; i++) {
                        this.trust_sites.push({ siteName: agentTrustSiteInfo[i].siteName, userCount: agentTrustSiteInfo[i].userCount });
                        // let str = `<div class="row"><div class="col-8">${agentTrustSiteInfo[i].siteName}</div><div class="col-4">${agentTrustSiteInfo[i].userCount}</div></div>`;
                        // $('#trust_site').append(str);
                    }
                    //左下『信任網站列表』顯示end↑↑------------------------------------


                    //右『稽核項目分類統計』顯示start↓↓------------------------------------
                    const agentAuditInfo = response.data.results.agentAuditInfo;//稽核項目統計


                    //因為risk_history是物件，因此無法用for處理，要使用Object.keys()！

                    Object.keys(agentAuditInfo).map((dateData) => {

                        let sum = agentAuditInfo[dateData][0] + agentAuditInfo[dateData][1] + agentAuditInfo[dateData][2] + agentAuditInfo[dateData][3];
                        let matchStr = (agentAuditInfo[dateData][0] / sum * 100).toFixed(1) + "%";//符合率
                        let notMatchStr = (agentAuditInfo[dateData][1] / sum * 100).toFixed(1) + "%";//未符合率
                        let notSetStr = (agentAuditInfo[dateData][2] / sum * 100).toFixed(1) + "%";//未設定率
                        let expectStr = (agentAuditInfo[dateData][3] / sum * 100).toFixed(1) + "%";//排除率
                        //let passed = (ratio.passed * 100).toFixed(2) + "%";

                        this.agentAuditInfo_datas.push({ name: dateData, match: matchStr, notMatch: notMatchStr, notSet: notSetStr, expect: expectStr });
                        /*
                        let agentAuditInfo_code = `
                            <div class="row">
                            <div class="col-5">
                                <div class="ml-1"><strong>${dateData}</strong></div>
                                <div class="progress">
                                    <div style="width:${match_num}; " class="progress-bar bg-success" ><small>${matchStr}</small></div>
                                    <div style="width:${notMatch_num}; " class="progress-bar bg-warning"><small>${notMatchStr}</small></div>
                                    <div style="width:${notSet_num};" class="progress-bar  bg-danger"><small>${notSetStr}</small></div>
                                    <div style="width:${expect_num};" class="progress-bar bg-info"><small>${expectStr}</small></div>
                                </div>
                            </div>
                            <div class="col">
                            <div class="row">
                                <div class="col-3 mt-3">${matchStr}</div>
                                <div class="col-3 mt-3">${notMatchStr}</div>
                                <div class="col-3 mt-3">${notSetStr}</div>
                                <div class="col-3 mt-3">${expectStr}</div>
                            </div>`;
                        $('#agentAuditInfo_id').append(agentAuditInfo_code);*/
                    });


                    //右『稽核項目分類統計』顯示end↑↑------------------------------------

                })
                .catch(error => {
                    console.log(error)
                });
        }
    },
    mounted() {
        this.fetchData();
    }
}).mount('#app');

			// Vue End↑↑------------------------------------




