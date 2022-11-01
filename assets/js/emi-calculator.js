$(document).ready(function () {
    /* var loadAmount = 100000;
    var yearlyInterestRate = 15;
    var totalMonths = 36; */
    var intervalId;
    var updateTime = 200;
    function calculate() {
        var loadAmount = Number($(".loanSlider").slider('value'));
        var yearlyInterestRate = Number($(".interestSlider").slider('value'));
        //var totalMonths = Number(($(".yearSlider").slider('value'))) * 12;
        var totalMonths = Number(($(".yearSlider").slider('value')));
        //console.log(loadAmount, yearlyInterestRate, totalMonths);
        var monthlyInterestRate = yearlyInterestRate / 12;
        var interestRateForCal = yearlyInterestRate / 100; // or (5/100) this rate is annual
        var presentValue = loadAmount; //this is loan
        var totalInterest = 0;
        var totalAmountPayble = 0;

        function PMT(ir, np, pv, fv = 0) {
            var presentValueInterstFector = Math.pow((1 + ir), np);
            var pmt = ir * pv * (presentValueInterstFector + fv) / (presentValueInterstFector - 1);
            return pmt;
        }
        var emiAmount = PMT(interestRateForCal / 12, totalMonths, presentValue); //output 
        $('.amortization_schedule tbody').empty()
        for (let i = 0; i < totalMonths; i++) {
            var monthlyInterest = presentValue * monthlyInterestRate / 100;
            var principal = emiAmount - monthlyInterest;
            var closingBalance = presentValue - principal;
            totalInterest += monthlyInterest;
            //----------
            /* console.log((i + 1), 'emi - ',
                Math.round(presentValue),
                Math.round(emiAmount),
                Math.round(monthlyInterest),
                Math.round(principal),
                Math.round(closingBalance)); */
            var tr = `<tr>
            <td data-label="year">`+ (i + 1) + `</td>
                <td data-label="opening balance">`+ Math.round(presentValue).toLocaleString('en-IN') + `</td>
                <td data-label="EMI*12">`+ Math.round(emiAmount).toLocaleString('en-IN') + `</td>
                <td data-label="interest paid yearly">`+ Math.round(monthlyInterest).toLocaleString('en-IN') + `</td>
                <td data-label="principal paid yearly">`+ Math.round(principal).toLocaleString('en-IN') + `</td>
                <td data-label="closing balance">`+ Math.abs(Math.round(closingBalance)).toLocaleString('en-IN') + `</td>
            </tr>`;
            $('.amortization_schedule tbody').append(tr);
            //---------------
            presentValue = closingBalance;

        }
        totalAmountPayble = totalInterest + loadAmount;
        $('.graphMonthlyEMI').html(Math.round(emiAmount).toLocaleString('en-IN'));
        $('.graphLoanAmt').html(Math.round(loadAmount).toLocaleString('en-IN'));
        $('.graphTotalInterest').html(Math.round(totalInterest).toLocaleString('en-IN'));
        $('.graphTotalPayble').html(Math.round(totalAmountPayble).toLocaleString('en-IN'));
        var loanGraphPercent = 100 * loadAmount / totalAmountPayble;
        var interestGraphPercent = 100 - loanGraphPercent;
        myChart.data.datasets[0].data = [loanGraphPercent, interestGraphPercent];
        myChart.update();
    }

    Chart.pluginService.register({
        beforeDraw: function (chart) {
            var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;
            ctx.restore();
            //var fontSize = (height / 114).toFixed(2);
            var fontSize = 0;
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";
            var text = chart.config.options.elements.center.text,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    });


    var sum = 0;
    var visitData = [];
    var percent = 70;
    var percentValue = percent;
    var textInside = sum.toString();

    var myChart = new Chart(document.getElementById('mychart'), {
        type: 'doughnut',
        animation: {
            animateScale: true
        },
        data: {
            labels: visitData,
            datasets: [{
                label: 'Visitor',
                data: [percentValue, 100 - percentValue],
                backgroundColor: [
                    "#fff",
                    "#4CEECD"
                ],
                borderWidth: 0
            }]
        },
        options: {
            elements: {
                center: {
                    text: textInside
                }
            },
            cutoutPercentage: 60,
            responsive: true,
            legend: false,
            tooltips: {
                enabled: true,
                mode: 'label',
                callbacks: {
                    label: function (tooltipItem, data) {
                        var indice = tooltipItem.index;
                        return data.datasets[0].data[indice] + " person visited " + data.labels[indice] + ' times';
                    }
                }
            },
        }
    });
    $('#my-legend-con').html(myChart.generateLegend());
    //-------------------
    $('.product_tb_con li').each((i, ele) => {
        $(ele).bind('click', () => {
            var This = $(ele);
            var data = This.data();
            $('.product_tb_con li').removeClass('active_tab');
            $(ele).addClass('active_tab');
            //---------------------------------------------
            //--- Loan Slider ----------------------------
            if ($('.loanSlider').slider("instance") != undefined) {
                $(".loanSlider").slider("destroy");
            }
            $($('.loanSlider ').parent().find('.range_val_con span')[0]).html(data.loanMin.toLocaleString('en-IN'));
            $($('.loanSlider ').parent().find('.range_val_con span')[1]).html(data.loanMax.toLocaleString('en-IN'));
            $(".loanSlider").slider({
                value: data.loanSelected,
                step: data.loanMin,
                min: data.loanMin,
                max: data.loanMax,
                create: function (event, ui, b) {
                    $('.loanSlider ').parent().find('.cal_tooltip').html(data.loanSelected.toLocaleString('en-IN'));
                },
                slide: function (event, ui) {
                    $('.loanSlider ').parent().find('.cal_tooltip').html(ui.value.toLocaleString('en-IN'));
                    calculate();
                },
                change: function (event, ui) {
                    calculate();
                }
            });
            //---------------------------------------------
            //--- Interest Slider ----------------------------
            if ($('.interestSlider').slider("instance") != undefined) {
                $(".interestSlider").slider("destroy");
            }
            $($('.interestSlider ').parent().find('.range_val_con span')[0]).html(data.interestMin.toLocaleString('en-IN')+'%');
            $($('.interestSlider ').parent().find('.range_val_con span')[1]).html(data.interestMax.toLocaleString('en-IN')+'%');
            $(".interestSlider").slider({
                value: data.interestSelected,
                step: 1,
                min: data.interestMin,
                max: data.interestMax,
                create: function (event, ui, b) {
                    $('.interestSlider ').parent().find('.cal_tooltip').html(data.interestSelected.toLocaleString('en-IN')+'%');
                },
                slide: function (event, ui) {
                    $('.interestSlider ').parent().find('.cal_tooltip').html(ui.value.toLocaleString('en-IN')+'%');
                    calculate();
                },
                change: function (event, ui) {
                    calculate();
                }
            });
            //---------------------------------------------
            //--- Month Slider ----------------------------
            if ($('.yearSlider').slider("instance") != undefined) {
                $(".yearSlider").slider("destroy");
            }
            /* $($('.yearSlider ').parent().find('.range_val_con span')[0]).html(data.yearMin*12+' months');
            $($('.yearSlider ').parent().find('.range_val_con span')[1]).html(data.yearMax*12+' months'); */
            console.log('data.yearSelected - ', data.yearSelected);
            $(".yearSlider").slider({
                value: data.yearSelected*12,
                step: 6,
                min: data.yearMin*12,
                max: data.yearMax*12,
                create: function (event, ui, b) {
                    $('.yearSlider ').parent().find('.cal_tooltip').html(data.yearSelected*12+' months');
                },
                slide: function (event, ui) {
                    //console.log('lll', ui.value);
                    $('.yearSlider ').parent().find('.cal_tooltip').html(ui.value+' months');
                    calculate();
                },
                change: function (event, ui) {
                    calculate();
                }
            });
            //
            calculate();
        });
    });
    var initialTabId = 0;
    if($($('.product_tb_con li')[initialTabId]).length>0){
        $($('.product_tb_con li')[initialTabId]).trigger('click');
    }
    

});